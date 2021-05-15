const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../data/users");
const games = require("../data/game");
const teams = require("../data/teamFunctions");

router.get("/", async (req, res) => {
  if(req.session.user) return res.render('pages/landing', {title: "Home | Stevens Esports", user: req.session.user})
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
    return res.redirect("/dashboard");
  } catch (e) {
    return res.status(401).render("pages/login", {
      title: "Account Login | Stevens Esports",
      error: errorMessage,
      scripts: ["/public/js/forms.js"],
    });
  }
});

router.get("/register", async (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  return res.render("pages/register", {
    title: "Account Registration | Stevens Esports",
    scripts: ["/public/js/forms.js"],
  });
});

router.post("/register", upload.single('avatar'), async (req, res) => {
  // TODO: Hash the password with bcrypt.hash, 16 salts, store it in password digest

  if (req.session.user) return res.redirect("/dashboard");
  let {
    firstName,
    lastName,
    nickname,
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
    req.file.buffer,
    biography
  );

  res.status(200).redirect("/login");
  return;
});

router.get("/team-sign-up", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  if(req.session.user) return res.render('pages/teamRegistration', {title: "Home | Stevens Esports", user: req.session.user})
  return res.render("pages/teamRegistration", {
    title: "Team Registration | Stevens Esports",
  });
});

router.get("/user-profile", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/userProfile", {
    title: "My Profile | Stevens Esports",
    user: req.session.user,
  });
});

router.get("/edit-profile", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/editProfile", {
    title: "Edit Profile | Stevens Esports",
  });
});

router.get("/change-password", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/changePW", {
    title: "Change Password | Stevens Esports",
  });
});

router.get("/dashboard", async (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render("pages/dashboard", {
    title: "Dashboard | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user === "administrator",
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
