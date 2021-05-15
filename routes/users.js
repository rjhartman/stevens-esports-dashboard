const express = require("express");
const router = express.Router();
const users = require("./../data/users.js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const upload = multer();
const xss = require("xss")

router.put('/:id', upload.single('avatar'), async (req, res) => {
    xss(req.body.firstName);
    xss(req.body.lastName);
    xss(req.body.username);
    xss(req.body.email);
    xss(req.body.nickname);
    xss(req.body.biography);
    xss(req.files)
    //all field except for 
    var user;
    try {
      // console.log(req.params.id);
        user = await users.getUserById(req.params.id);
    } catch(e){
        res.sendStatus(404);
    }
    let { firstName, lastName, username, email, nickname, biography } = req.body;
    let errorMessage = "";
  
    // Test if first name field is filled in or not
    if(firstName == undefined || firstName.trim() == ''){
      errorMessage = 'First name field cannot be empty.';
      //change the render page to the edit-profile page
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                              });
      return;
    }
  
    // Test if last name field is filled in or not
    if(lastName == undefined || lastName.trim() == ''){
      errorMessage = 'Last name field cannot be empty.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
      return;
    }
  
    // Test if nickname field is filled in or not
    if(nickname == undefined || nickname.trim() == ''){
      errorMessage = 'Nickname field cannot be empty.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
      return;   
    }
  
    // Test if email field is filled in or not
    if(email == undefined || email.trim() == ''){
      errorMessage = 'Email field cannot be empty.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
      return;       
    }
  
    // Test if email is valid format
    if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
      errorMessage = 'Email not valid format.'
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
      return;     
    }
  
    // Test if username field is filled in or not
    if(username == undefined || username.trim() == ''){
      errorMessage = 'Username field cannot be empty.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
      return;       
    }
  
  
    // Test if username already exists
    try{
      await users.getUser(username);
      errorMessage = 'Username already taken. Please choose another one.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                              });
      return;
    } catch(e){   
      // Don't do anything
    }
  
    // Test if email already exists
    try{
      await users.getUser(email);
      errorMessage = 'Email already used. Please choose another one.';
      res.status(400).render('pages/register', {title: "Account Registration | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                              });
      return;
    } catch(e){
      // Don't do anything
    }
  
    // password = password.trim();
    // hashedPassword = await bcrypt.hash(password, 16);
    console.log(user);
    userInfo = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        passwordDigest: user.passwordDigest,
        nickname: nickname,
        role: user.role,
        biography: biography,
        avatar: xss(req.file.buffer),
    }
    try {
        // checkMatchObj(matchInfo);
        const updatedUser = await users.updateUser(req.params.id,userInfo);
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    var user;
    try {
      // console.log(req.params.id);
        user = await users.getUserById(req.params.id);
    
    } catch(e){
        
        res.sendStatus(404);
    }
    let inputObj = req.body;
    // console.log(inputObj);
    let errorMessage = "";
    if ('firstName' in inputObj){
        firstName = inputObj.firstName;
        if(firstName == undefined || firstName.trim() == ''){
            errorMessage = 'First name field cannot be empty.';
            //change the render page to the edit-profile page
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          }
        user.firstName = firstName;
    }
    if ('lastName' in inputObj){
        lastName = inputObj.lastName;
        if(lastName == undefined || lastName.trim() == ''){
            errorMessage = 'Last name field cannot be empty.';
            //change the render page to the edit-profile page
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          }
        user.lastName = lastName;
    }
    if ('username' in inputObj){
        username = inputObj.username;
        if(username == undefined || username.trim() == ''){
            errorMessage = 'Username field cannot be empty.';
            //change the render page to the edit-profile page
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          }
        try{
            await users.getUser(username);
            errorMessage = 'Username already taken. Please choose another one.';
            res.status(400).render('pages/editProfile', {title: "Account Registration | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
        } catch(e){   
            // Don't do anything
        }
        user.userame = userame;
    }
    if ('email' in inputObj){
        email = inputObj.email;
        if(email == undefined || email.trim() == ''){
            errorMessage = 'Email field cannot be empty.';
            //change the render page to the edit-profile page
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          }
        // Test if email is valid format
        if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
            errorMessage = 'Email not valid format.'
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                    scripts: ["/public/js/forms.js"],
                                                    error: errorMessage
                                                    });
            return;     
        }
        try{
            await users.getUser(email);
            errorMessage = 'Email already used. Please choose another one.';
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          } catch(e){
            // Don't do anything
          }
        user.email = email;
    }
    if ('nickname' in inputObj){
        nickname = inputObj.nickname;
        if(nickname == undefined || nickname.trim() == ''){
            errorMessage = 'Last name field cannot be empty.';
            //change the render page to the edit-profile page
            res.status(400).render('pages/editProfile', {title: "Edit Profile | Stevens Esports",
                                                      scripts: ["/public/js/forms.js"],
                                                      error: errorMessage
                                                    });
            return;
          }
        user.nickname = nickname;
    }
    if ('biography' in inputObj){
        biography = inputObj.biography;
        user.biography = biography;
    }
    if (typeof req.files !== 'undefined' && req.files.length > 0){
        user.avatar = req.file.buffer;
    }
    userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        passwordDigest: user.passwordDigest,
        nickname: user.nickname,
        role: user.role,
        biography: user.biography,
        avatar: user.avatar,
    }
    try{
        const updatedUser = await users.updateUser(req.params.id,userInfo);
        //prob want to send the user back to profile page 
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});

router.patch('/password/:id', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    // requires the fields current password, new password, and confirm password
    var user;
    try {
      // console.log(req.params.id);
        user = await users.getUserById(req.params.id);
    
    } catch(e){
        
        res.sendStatus(404);
    }
    let inputObj = req.body;
    let errorMessage = "";
    let curr_password = inputObj.currentPassword;
    if (!(await bcrypt.compare(curr_password, user.passwordDigest))){
        errorMessage = 'Current Password is incorrect.';
        res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
        return;  
    }
    // Test if password field is filled in or not
    let password = inputObj.newPassword
    if(password == undefined || password.trim() == ''){
        errorMessage = 'New Password field cannot be empty.';
        res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
        return;       
    }
    // Test if confirm password field is filled in or not
    let confirm_password = inputObj.confirmPassword
    if(confirm_password == undefined || confirm_password.trim() == ''){
        errorMessage = 'Confirm password field cannot be empty.';
        res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                                scripts: ["/public/js/forms.js"],
                                                error: errorMessage
                                                });
        return;           
    }
    if(password !== confirm_password){
        errorMessage = 'Password fields do not match.';
        res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                                  scripts: ["/public/js/forms.js"],
                                                  error: errorMessage
                                                });
        return;
    }

    password = password.trim();
    hashedPassword = await bcrypt.hash(password, 16);
    //nothing should be changed aside from password
    let userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        passwordDigest: hashedPassword,
        nickname: user.nickname,
        role: user.role,
        biography: user.biography,
        avatar: user.avatar,
    };
    
    try{
        const updatedUser = await users.updateUser(req.params.id,userInfo);
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});
module.exports = router;