const path = require('path');

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('index.html'));
    });
    /*app.get('/', (req, res) => {
        res.render('pages/landing', {title: 'Stevens Esports'});
    });*/
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found!'});
    });
};

module.exports = constructorMethod;