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

router.get('/products/new', function(req, res) {
  res.render('new_product');
});

router.post('/users/session', function(req, res) {
  res.cookie('user_id', req.body.id, { expires: 0, httpOnly: true });
  res.statusCode(200).send("Done");
});

router.get("/users/logout", function(req, res){
  res.clearCookie("user_id");
  res.redirect("/");
});

router.get('/products/:id', function(req, res) {
  request('http://localhost:9000/api/products/'+req.params.id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('show_product', { product: JSON.parse(body) })
    }
  })
});

router.post('/login', function(req, res) {
  request('http://localhost:9000/api/users/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var users = JSON.parse(body);
      var user_id = find_user_id(users,req.body.email);
      res.cookie('user_id', user_id, { expires: 0, httpOnly: true });
      res.send("Done");
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