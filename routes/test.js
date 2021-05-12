const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  return res.render("pages/landing", { title: "Home | Stevens Esports" });
});

router.get("/login", async (req, res) => {
  return res.render("pages/login", {
    title: "Account Login | Stevens Esports",
    scripts: ["/public/js/forms.js"],
  });
});

router.post("/login", async (req, res) => {});

router.get("/team-sign-up", async (req, res) => {
  return res.render("pages/teamRegistration", {
    title: "Team Registration | Stevens Esports",
  });
});

module.exports = router;
