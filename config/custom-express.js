const expressValidator = require('express-validator');
const express          = require('express');
const consign          = require('consign');
const bodyParser       = require('body-parser');

module.exports = () => {
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  consign()
   .include('controllers')
   .then('model')
   .into(app);

  return app;
}
