$(function(){

  $(document).foundation();

  $("#new_product").on("submit", function(){
    event.preventDefault();
    var product = {};
    product.addedBy = $(this).find("input[name=user_id]").val();
    product.bestBefore = Date.now();
    product.name = $(this).find("input[name=name]").val();
    product.quantity = $(this).find("input[name=quantity]").val();
    product.image = $(this).find("input[name=image]").val();

    var transaction = {};
    transaction.giverId = $(this).find("input[name=user_id]").val();
    transaction.availableTime = $(this).find("input[name=availableTime]").val();
    transaction.location = $(this).find("input[name=location]").val();
    transaction.status = "open";

    $.ajax({
      url: "http://localhost:9000/api/products",
      type: "post",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + document.cookie.split(";")[0].split("=")[1]);},
      data: product
    }).done(function(product){
      transaction.products = product._id;
      $.ajax({
        url: "http://localhost:9000/api/transactions/",
        type: "post",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + document.cookie.split(";")[0].split("=")[1]);},
        data: transaction
      }).done(function(){
        window.location.href="http://localhost:3000"
      })
    })
  });

$("#sign_up").on("submit", function(){
  event.preventDefault();
  var user = {};
  user.username = $(this).find("input[name=username]").val();
  user.email = $(this).find("input[name=email]").val();
  user.password = $(this).find("input[name=password]").val();
  user.location = $(this).find("input[name=location]").val();
  user.reputation = 0;
  $.ajax({
    url: "http://localhost:9000/api/users",
    type: "post",
    data: user
  }).done(function(data){
    document.cookie="token="+data.token;
    document.cookie="user_id="+data.user.id;
    window.location.href="http://localhost:3000";
  });
});

$("body").on("click", ".delete_transaction", function(){
  event.preventDefault();
  var transaction_id = $(this).attr("id");
  $.ajax({
    url: "http://localhost:9000/api/transactions/" + transaction_id,
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + document.cookie.split(";")[0].split("=")[1]);},
    type: "delete"
  }).done(function(){
    window.location.href="http://localhost:3000"
  });
})

$("#login").on("submit",function(){
  event.preventDefault();
  var email = $(this).find("input[name=email]").val();
  var password = $(this).find("input[name=password]").val();
  $.ajax({
    url: "http://localhost:9000/api/users/login",
    type: "POST",
    data: {email: email, password: password}
  }).done(function(data){
    document.cookie="token="+data.token;
    document.cookie="user_id="+data.user.id;
    window.location.href="http://localhost:3000";
  })
})

$("#update_transaction").on("submit",function(){
  event.preventDefault();
  var takerId = $(this).find("input[name=taker_id]").val();
  var meetingTime = $(this).find("input[name=meetingTime]").val();
  $.ajax({
    url: "http://localhost:9000/api" + $(this).attr("action"),
    type: "PUT",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + document.cookie.split(";")[0].split("=")[1]);},
    data: {takerId: takerId, meetingTime: Date.now(), status:"taken"}
  }).done(function(){
    window.location.href="http://localhost:3000";
  })
})

$(".rate_transaction").on("submit", function(){
  event.preventDefault();
  var rating = $(this).find("select").val();
  var transaction_id = $(this).attr("id");
  var giver_id = $(this).data().giverId;
  console.log(giver_id);
  var status = "rated";
  // Reset status and rating if the transaction failed
  $.ajax({
    url: "http://localhost:9000/api/users/" + document.cookie.split(";")[1].split("=")[1],
    type: "PUT",
    headers: {
      'Authorization': "Bearer " + document.cookie.split(";")[0].split("=")[1]
    },
    contentType: "application/json",
    data: JSON.stringify({$inc: {reputation: rating}})
  })
  .done(function(){
      if(rating == -5) {
        status="open";
        rating=0;
      }
    $.ajax({
      url: "http://localhost:9000/api/transactions/" + transaction_id,
      type: "PUT",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + document.cookie.split(";")[0].split("=")[1]);},
      data: {rating: rating, status: status}
    }).done(function(){
      window.location.href="http://localhost:3000";
    })
  })
})

});