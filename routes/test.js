const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../data/users");

router.get("/", async (req, res) => {
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

router.post("/register", async (req, res) => {
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
    return res.status(401).render("pages/register", {
      title: "Account Registration | Stevens Esports",
      error: errorMessage,
      scripts: ["/public/js/forms.js"],
    });
  }
});

router.get("/team-sign-up", async (req, res) => {
  return res.render("pages/teamRegistration", {
    title: "Team Registration | Stevens Esports",
  });
});

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", {
    title: "Dashboard | Stevens Esports",
    user: req.session.user,
    isAdmin: req.session.user === "administrator",
    layout: "backend",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
