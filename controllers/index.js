var express = require('express');
var request = require("request");
var router = express.Router();

router.get('/', function(req, res) {
  request('http://localhost:9000/api/transactions', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('index', { transactions: JSON.parse(body)})
    }
  })
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/products/new', function(req, res) {
  res.render('new_product');
});

router.get("/users/logout", function(req, res){
  res.clearCookie("user_id");
  res.clearCookie("token");
  res.redirect("/");
});

router.get('/transactions/:id', function(req, res) {
  request({
    url: 'http://localhost:9000/api/transactions/'+req.params.id, 
    headers:{'Authorization': "Bearer " + req.cookies.token}
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('show_transaction', { transaction: JSON.parse(body) })
    } else {
      res.redirect("/")
    }
  })
});

router.get('/transaction_status', function(req, res) {
    request('http://localhost:9000/api/transactions', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('transaction_status', { transactions: JSON.parse(body) })
    }
  })
});

module.exports = router;