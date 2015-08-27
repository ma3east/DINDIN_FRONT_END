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
      var result = JSON.parse(body);
      res.render('transaction_status', { transactions: sort_transactions(result) })
    }
  })
});

function sort_transactions(result){
  var transactions = {
    open: [],
    upcoming: [],
    toBeRated: []
  };

  result.forEach(function(transaction){
    var isGiver = (transaction.giverId._id === currentUser);
    if(isGiver && transaction.status==="open"){
      transactions.open.push(transaction);
    } else if(transaction.status ==="taken" && (new Date(transaction.meetingTime) >= Date.now())){
      var isTaker = (transaction.takerId._id === currentUser);
      if(isGiver || isTaker){
        transactions.upcoming.push(transaction);
      }
    } else if(transaction.status !== "closed" && transaction.status !== "open"){ 
      var isTaker = (transaction.takerId._id === currentUser);
      if( (isGiver && transaction.status !== "ratedByGiver") || (isTaker && transaction.status !== "ratedByTaker")){
        transactions.toBeRated.push(transaction);
      }
    }
  })

  return transactions;
}

module.exports = router;