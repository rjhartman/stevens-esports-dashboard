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

module.exports = router;