var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var expressLayouts = require('express-ejs-layouts');
var sassMiddleware = require('node-sass-middleware');
app.use(bodyParser.urlencoded({extended: false}));

app.set("views", "./views");
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs')
app.use(expressLayouts);
app.use(logger('dev'));
app.use(sassMiddleware({
  src: __dirname + '/scss', 
  dest: __dirname + '/public', 
  debug: true, 
  outputStyle: 'compressed' 
  }), 
  express.static(__dirname + '/public')
)


// app.use(express.static(__dirname + '/public'));

app.use(require('./controllers'));

app.listen(process.env.PORT || 3000);