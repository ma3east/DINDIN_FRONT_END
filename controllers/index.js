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

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/products/new', function(req, res) {
  res.render('new_product');
});

router.post('/users/session', function(req, res) {
  res.cookie('user_id', req.body.id, { expires: 0, httpOnly: false });
  res.statusCode(200).send("Done");
});

router.get("/users/logout", function(req, res){
  res.clearCookie("user_id");
  res.redirect("/");
});

router.get('/transactions/:id', function(req, res) {
  // request({
  //   url: 'http://localhost:9000/api/transactions/'+req.params.id, 
  //   headers:{'Authorization': "Bearer " + req.cookies.token;}
  // }, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     res.render('show_transaction', { product: JSON.parse(body).products[0], transaction: JSON.parse(body) })
  //   } else {
  //     res.redirect("/")
  //   }
  // })

  request('http://localhost:9000/api/transactions/'+req.params.id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('show_transaction', { product: JSON.parse(body).products[0], transaction: JSON.parse(body) })
    } else {
      res.redirect("/")
    }
  })
});

router.post('/login', function(req, res) {
  request('http://localhost:9000/api/users', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var users = JSON.parse(body);
      var user_id = find_user_id(users,req.body.email);
      res.cookie('user_id', user_id, { expires: 0, httpOnly: false });
      res.send("Done");
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

// TO BE DELETED IF WE HAVE TOKENS
function find_user_id(array, email){
  var user_id = null;
  array.forEach(function(user){
    if(user.email===email){ user_id = user._id }
  });
  return user_id;
}

module.exports = router;