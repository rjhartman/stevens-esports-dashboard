const teamRoutes = require('./teams');

const constructorMethod = (app) => {
  app.use('/teams', teamRoutes);
//   app.use('/', teamRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found!'});
  });
};

module.exports = constructorMethod;
