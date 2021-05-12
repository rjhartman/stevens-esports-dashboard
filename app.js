const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const path = require("path");
const session = require("express-session");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const e = require("express");

app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "StevensEsportsDashboard",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 },
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
app.use("/admin", (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  else next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
