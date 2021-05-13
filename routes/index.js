const playerRoutes = require('./players');

const constructorMethod = (app) => {
    app.use('/player', playerRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).render('player/error', {title: 'Error', error: '404: Not found'});
    });
  };
  
module.exports = constructorMethod;