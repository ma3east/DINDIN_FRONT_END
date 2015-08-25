var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var expressLayouts = require('express-ejs-layouts');
var sassMiddleware = require('node-sass-middleware');
var cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

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

app.use(function(req,res,next){
  console.log(req.cookies.user_id);
  global.currentUser = req.cookies.user_id || null;
  next();
})

app.use(require('./controllers'));

app.listen(process.env.PORT || 3000);