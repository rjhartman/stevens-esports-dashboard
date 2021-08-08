const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../data/users");
const games = require("../data/game");
const teams = require("../data/teamFunctions");

router.get("/", async (req, res) => {
  if(req.session.user)
    return res.render('pages/landing', {
      title: "Home | Stevens Esports",
      user: req.session.user,
      isAdmin: req.session.user.role === "administrator"
    });
  return res.render("pages/landing", { title: "Home | Stevens Esports" });
});

router.get("/login", async (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  return res.render("pages/login", {
    title: "Account Login | Stevens Esports",
    scripts: ["/public/js/forms.js"],
  });
});

router.post("/login", async (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  let { username, password } = req.body;
  let errorMessage = "Invalid username/password.";
  try {
    if (!username || !(username = username.trim())) {
      errorMessage = "Username was empty.";
      throw errorMessage;
    }
    if (!password || !(password = password.trim())) {
      errorMessage = "Password was empty.";
      throw errorMessage;
    }

    let user;
    try {
      user = await users.getUser(username);
    } catch {
      // Even though we don't have to do an expensive compare,
      // do one anyway to throttle attempts to brute force, and
      // not allow an attacker to know when a username or password is
      // incorrect based on load times.
      const random = await users.getRandomUser();
      await bcrypt.compare(password, random.passwordDigest);
      throw errorMessage;
    }
    if (!(await bcrypt.compare(password, user.passwordDigest)))
      throw errorMessage;

    // Don't return the password's hash!
    delete user.passwordDigest;
    user.isAdmin = user.role === "administrator";
    req.session.user = user;
    return res.redirect("/");
  } catch (e) {
    return res.status(401).render("pages/login", {
      title: "Account Login | Stevens Esports",
      error: errorMessage,
      scripts: ["/public/js/forms.js"],
    });
  }
});

router.get("/about-us", async (req, res) => {
  if(!req.session.user)
    return res.render("pages/aboutUs", {
      title: "About Us | Stevens Esports",
      scripts: ["/public/js/forms.js"],
    });
  else {
    return res.render("pages/aboutUs", {
      title: "About Us | Stevens Esports",
      user: req.session.user,
      isAdmin: req.session.user.role === "administrator",
      scripts: ["/public/js/forms.js"],
    });
  }
});

router.get("/register", async (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  return res.render("pages/register", {
    title: "Account Registration | Stevens Esports"
  });
});

router.post("/register", async (req, res) => {
  // TODO: Hash the password with bcrypt.hash, 16 salts, store it in password digest

  if (req.session.user) return res.redirect("/dashboard");
  let {
    firstName,
    lastName,
    nickname,
    discord,
    username,
    password,
    confirm_password,
    email,
    biography,
  } = req.body;
  let errorMessage = "";

  // Test if first name field is filled in or not
  if (firstName == undefined || firstName.trim() == "") {
    errorMessage = "First name field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if last name field is filled in or not
  if (lastName == undefined || lastName.trim() == "") {
    errorMessage = "Last name field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if nickname field is filled in or not
  if (nickname == undefined || nickname.trim() == "") {
    errorMessage = "Nickname field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if email field is filled in or not
  if (email == undefined || email.trim() == "") {
    errorMessage = "Email field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if email is valid format
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    errorMessage = "Email not valid format.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if discord is in correct format
  if (
    !/^.{3,32}#[0-9]{4}$/.test(
      discord
    )
  ) {
    errorMessage = "Discord tag not valid format.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if username field is filled in or not
  if (username == undefined || username.trim() == "") {
    errorMessage = "Username field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if password field is filled in or not
  if (password == undefined || password.trim() == "") {
    errorMessage = "Password field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if confirm password field is filled in or not
  if (confirm_password == undefined || confirm_password.trim() == "") {
    errorMessage = "Confirm password field cannot be empty.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  // Test if username already exists
  try {
    await users.getUser(username);
    errorMessage = "Username already taken. Please choose another one.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  } catch (e) {
    // Don't do anything
  }

  // Test if email already exists
  try {
    await users.getUser(email);
    errorMessage = "Email already used. Please choose another one.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  } catch (e) {
    // Don't do anything
  }

  // Test if password box and confirm password box matches
  if (password !== confirm_password) {
    errorMessage = "Password fields do not match.";
    res.status(400).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      scripts: ["/public/js/forms.js"],
      error: errorMessage,
    });
    return;
  }

  password = password.trim();
  hashedPassword = await bcrypt.hash(password, 16);

  await users.addUser(
    firstName,
    lastName,
    username,
    email,
    hashedPassword,
    nickname,
    biography
  );

  res.status(200).redirect("/login");
  return;
});

router.get("/team-sign-up", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  if(req.session.user) return res.render('pages/teamRegistration', {
    title: "Team Registration | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
  });
  return res.render("pages/teamRegistration", {
    title: "Team Registration | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
  });
});

router.get("/user-profile", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/userProfile", {
    title: "My Profile | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
  });
});

router.get("/edit-profile", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/editProfile", {
    title: "Edit Profile | Stevens Esports",
    scripts: ["/public/js/forms.js"],
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
  });
});

router.get("/change-password", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/changePW", {
    title: "Change Password | Stevens Esports",
    scripts: ["/public/js/forms.js"],
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
  });
});

router.patch('/user', upload.single('avatar'), async (req, res) => {
  var user;
  try {
    // console.log(req.params.id);
      user = await users.getUser(req.session.user.username);
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
      user.username = username;
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
  if (req.file){
      user.avatar = req.file.buffer;
  }
  let userInfo = {
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
      const updatedUser = await users.updateUser(req.session.user._id.toString(), userInfo);
      //prob want to send the user back to profile page 
      req.session.destroy();
      return res.sendStatus(200);
  } catch(e){
      res.status(400).json({ error: e });
      return;
  }
});

router.patch('/user/password', upload.single('avatar'), async (req, res) => {
  // requires the fields current password, new password, and confirm password
  var user;
  try {
    // console.log(req.params.id);
      user = await users.getUser(req.session.user.username);
  
  } catch(e){
      
      res.sendStatus(404);
  }
  let inputObj = req.body;
  let errorMessage = "";
  let curr_password = inputObj.cur_password;
  if (!(await bcrypt.compare(curr_password, user.passwordDigest))){
      errorMessage = 'Current Password is incorrect.';
      res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                              scripts: ["/public/js/forms.js"],
                                              error: errorMessage
                                              });
      return;  
  }
  // Test if password field is filled in or not
  let password = inputObj.new_password;
  if(password == undefined || password.trim() == ''){
      errorMessage = 'New Password field cannot be empty.';
      res.status(400).render('pages/changePW', {title: "Password Change | Stevens Esports",
                                              scripts: ["/public/js/forms.js"],
                                              error: errorMessage
                                              });
      return;       
  }
  // Test if confirm password field is filled in or not
  let confirm_password = inputObj.confirm_password;
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
      const updatedUser = await users.updateUser(req.session.user._id.toString(), userInfo);
      req.session.destroy();
      return res.sendStatus(200);
  } catch(e){
      res.status(400).json({ error: e });
  }
});

router.get("/dashboard", async (req, res) => {
  if(!req.session.user || req.session.user.role === "regular")
    return res.redirect('/');
  res.render("pages/dashboard", {
    title: "Dashboard | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user.role === "administrator",
    games: await games.getAllGames(),
    teams: await teams.getAllTeams(),
    layout: "backend",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
