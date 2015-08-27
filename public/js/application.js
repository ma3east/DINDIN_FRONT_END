$(function(){
  if(document.cookie){
  var token = document.cookie.split(";")[0].split("=")[1];
  var currentUser = document.cookie.split(";")[1].split("=")[1];
  $.ajax({
    url: "http://localhost:9000/api/users/"+ currentUser,
    type: "GET",
    headers: { 'Authorization': "Bearer " + token }
  }).done(function(user){
    $("#username").find("i").html(user.username);
  })
  }
  
  $(document).foundation();

  $('#datetimepicker').datetimepicker({format: "d/m/Y H:i", scrollInput: false});
  $('.datepicker').datetimepicker({timepicker: false, format: "d/m/Y", scrollInput: false});
  $('.timepicker').datetimepicker({datepicker:false, format:'H:i', scrollInput: false});

  $.ajax({
    url: "http://localhost:9000/api/transactions",
    type: "GET",
    headers: { 'Authorization': "Bearer " + token }
  }).done(function(transactions){
    var valid_transactions = [];
    transactions.forEach(function(transaction){
      if(transaction.status !== "open" && transaction.status !== "closed"){
        var isTaker = (transaction.takerId._id === currentUser);
        var isGiver = (transaction.giverId._id === currentUser);
        if(isGiver || isTaker){
          valid_transactions.push(transaction);
        }
      }
    });
    $("#notification").hide();
    if(valid_transactions.length>0){
      $("#notification").show();
      $("#notification").html(valid_transactions.length);
      $("#notification").on("click", function(){
        event.stopPropagation();
        event.preventDefault();
        window.location.href="http://localhost:3000/transaction_status"
      });
    }
  })



  $("#new_product").on("submit", function(){
    event.preventDefault();
    var product = {};
    product.addedBy = $(this).find("input[name=user_id]").val();
    date = $(this).find("input[name=bestBefore]").val();
    product.bestBefore = parseUKdate(date);
    var datestring = $(this).find("input[name=availableTimeDate]").val();
    var time1 = $(this).find("input[name=availableTimeStart]").val();
    var time2 = $(this).find("input[name=availableTimeStart]").val();
    product.availableTime = parseUKtimeslot(datestring, time1, time2);
    product.name = $(this).find("input[name=name]").val();
    product.quantity = 1;
    product.image = $(this).find("input[name=image]").val();

    var transaction = {};
    transaction.giverId = $(this).find("input[name=user_id]").val();
    transaction.availableTime = $(this).find("input[name=availableTime]").val();
    transaction.location = $(this).find("input[name=location]").val();
    transaction.status = "open";

    $.ajax({
      url: "http://localhost:9000/api/products",
      type: "post",
      headers: { 'Authorization': "Bearer " + token },
      data: product
    }).done(function(product){
      console.log(product);
      if(!product.errors){
        transaction.products = product._id;
        $.ajax({
          url: "http://localhost:9000/api/transactions/",
          type: "post",
          headers: { 'Authorization': "Bearer " + token },
          data: transaction
        }).done(function(){
          window.location.href="http://localhost:3000"
        })
      }
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
    headers: { 'Authorization': "Bearer " + token },
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
  var meetingTime = parseUKdatetime($(this).find("input[name=meetingTime]").val());
  $.ajax({
    url: "http://localhost:9000/api" + $(this).attr("action"),
    type: "PUT",
    headers: { 'Authorization': "Bearer " + token },
    data: {takerId: takerId, meetingTime: meetingTime, status:"taken"}
  }).done(function(data){
    window.location.href="http://localhost:3000";
  })
})

$(".rate_transaction").on("submit", function(){
  event.preventDefault();
  var rating = $(this).find("select").val();
  var transaction_id = $(this).attr("id");
  var user_id = $(this).data().userid;
  var isGiver = $(this).data().isgiver;
  var status = $(this).data().status;
  if (status === "taken" && isGiver === "true") {
    status = "ratedByGiver";
  } else if(status === "taken" && isGiver === "false"){
    status = "ratedByTaker";
  } else {
    status = "closed";
  }
  $.ajax({
    url: "http://localhost:9000/api/users/" + user_id,
    type: "PUT",
    headers: { 'Authorization': "Bearer " + token },
    contentType: "application/json",
    data: JSON.stringify({$inc: {reputation: rating}})
  })
  .done(function(){
  // Reset status and rating if the transaction failed
  if(rating == -5) {
    status="open";
    rating=0;
  }
  $.ajax({
    url: "http://localhost:9000/api/transactions/" + transaction_id,
    type: "PUT",
    headers: { 'Authorization': "Bearer " + token },
    data: {rating: rating, status: status}
  }).done(function(){
    window.location.href="http://localhost:3000";
  })
})
})

$(".cancel_transaction").on("click", function(){
  event.preventDefault();
  console.log("clicked");
  var transaction_id = $(this).attr("id");
  var user_id = $(this).data().userid;
  $.ajax({
    url: "http://localhost:9000/api/transactions/" + transaction_id,
    type: "PUT",
    headers: { 'Authorization': "Bearer " + token },
    data: {status: "open"}
  }).done(function(){
    $.ajax({
      url: "http://localhost:9000/api/users/" + user_id,
      type: "PUT",
      headers: { 'Authorization': "Bearer " + token },
      contentType: "application/json",
      data: JSON.stringify({$inc: {reputation: -2}})
    }).done(function(){
      window.location.href="http://localhost:3000";
    })
  })
})

$(".search_product").on("submit", function(){
  event.preventDefault();
  var search = $(this).find("input[name=search]").val();
  $.ajax({
    url: "http://localhost:9000/api/products/search",
    type: "POST",
    headers: { 'Authorization': "Bearer " + token },
    data: {search: search}
  }).done(function(data){
    data.forEach(function(product){
      var name=product.Name.replace("Tesco ","");
      $("#product_container").append("<li class='product_item'><img src=" + product.ImagePath + " class='product-img'><p>"+ name +"</p></li>");
    })
  })
})

$("#product_container").on("click", ".product_item", function(){
  $(".product_item").removeClass("active-product");
  $(this).addClass("active-product");
  $("input[name=name]").val($(this).find("p").html());
  $("input[name=image]").val($(this).find("img").attr("src"));
})

});

function parseUKdatetime(string){
  var date = string.split(" ")[0].split("/");
  var time = string.split(" ")[1].split(":");
  var result = new Date(date[1]+"/"+date[0]+"/"+date[2]);
  result.setHours(time[0]);
  result.setMinutes(time[1]);
  return result;
}

function parseUKdate(datestring){
  datestring = string.split("/");
  return new Date(date[1]+"/"+date[0]+"/"+date[2]);
}

function parseUKtimeslot(datestring, time1, time2){
  var date = parseUKdate(datestring);
  var date1 = date;
  var date2 = date;
  var time1 = time1.split(":");
  var time2 = time2.split(":");
  date1.setHours(time1[0]);
  date1.setMinutes(time1[1]);
  date2.setHours(time2[0]);
  date2.setMinutes(time2[1]);
  console.log([date1,date2]);
  return [date1,date2];
}