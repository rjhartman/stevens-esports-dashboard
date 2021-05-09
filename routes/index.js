const test = require('./test');
const matchRoute = require('./match');

const constructorMethod = (app) => {
    app.use('/', test);
    app.use('/schedule', matchRoute);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found!'});
    });
};

module.exports = constructorMethod;