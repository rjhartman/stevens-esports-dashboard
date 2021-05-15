const express = require("express");
const router = express.Router();
const users = require("./../data/users.js");

router.put('/:id', async (req, res) => {
    //all field except for password
    var user;
    try {
      // console.log(req.params.id);
        user = await users.getUserById(req.params.id);
    } catch(e){
        res.sendStatus(404);
    }
    let { firstName, lastName, username, email, nickname, biography, avatar} = req.body;
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
        avatar: avatar,
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

});

module.exports = router;