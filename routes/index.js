const test = require('./test');
const matchRoute = require('./match');
const playerRoute = require('./players')
const apiRoutes = require("./api");
const teamRoutes = require('./teams');

const constructorMethod = (app) => {
    app.use('/', test);
    app.use('/schedule', matchRoute);
    app.use('/player', playerRoute)
    app.use('/api', apiRoutes)
    app.use('/teams', teamRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found!'});
    });
};

module.exports = constructorMethod;
