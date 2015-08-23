var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var expressLayouts = require('express-ejs-layouts');
app.use(bodyParser.urlencoded({extended: false}));

app.set("views", "./views");
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs')
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.use(require('./controllers'));

app.listen(process.env.PORT || 3001);