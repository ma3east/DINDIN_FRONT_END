var express = require('express');
var request = require("request");
var router = express.Router();

router.get('/', function(req, res) {
  request('http://localhost:9000/api/products/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('index', { products: JSON.parse(body) })
    }
  })
});

router.get('/login', function(req, res) {
    res.render('login');
});

module.exports = router;