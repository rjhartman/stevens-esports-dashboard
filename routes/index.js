const matchRoute = require('./match');

const constructorMethod = (app) => {
//   app.use('/', searchRoute);
  app.use('/match', matchRoute);
  

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;