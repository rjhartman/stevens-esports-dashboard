const test = require("./test");
const matchRoute = require("./match");
const apiRoutes = require("./api");

const constructorMethod = (app) => {
  app.use("/", test);
  app.use("/schedule", matchRoute);
  app.use("/api", apiRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found!" });
  });
};

module.exports = constructorMethod;
