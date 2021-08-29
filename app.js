require("dotenv").config();
const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const path = require("path");
const session = require("cookie-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "StevensEsportsDashboard",
    secret: process.env.SESSION_SECRET || "t@FBc924fCnkUy#LDFzKtV7Ea92S",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000000 },
  })
);

app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: [path.join(__dirname, "views/partials/")],
  })
);
app.set("view engine", "handlebars");

// Ensure a user is authenticated
app.use("/dashboard", (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  else next();
});

// Ensure users who try to use certain actions in the dashboard have
// sufficient permissions.
app.use("/dashboard/admin", (req, res, next) => {
  if (req.session.user.role !== "administrator") return res.status(401).send();
  next();
});

// Ensure users who request information from the API have the
// sufficient permissions.
app.use("/api", (req, res, next) => {
  if (req.session.user.role !== "administrator") return res.status(401).send();
  next();
});

configRoutes(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
