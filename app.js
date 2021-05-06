const express = require('express');
const app = express();

const exphbs = require("express-handlebars");

const static = express.static(__dirname + '/public');
app.use('/public', static);
const configRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});