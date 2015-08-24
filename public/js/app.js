$(function(){

  $(document).foundation();

  $("#new_product").on("submit", function(){
    event.preventDefault();
    var product = {};
    product.bestBefore = Date.now();
    product.name = $(this).find("input[name=name]").val();
    product.quantity = $(this).find("input[name=quantity]").val();
    product.image = $(this).find("input[name=image]").val();
    $.ajax({
      url: "http://localhost:9000/api/products/",
      type: "post",
      data: product,
      success: window.location.href="http://localhost:3000/"
    })
  });

  $("#sign_up").on("submit", function(){
    event.preventDefault();
    var user = {};
    user.username = $(this).find("input[name=username]").val();
    user.email = $(this).find("input[name=email]").val();
    user.password = $(this).find("input[name=password]").val();
    user.location = $(this).find("input[name=location]").val();
    $.ajax({
      url: "http://localhost:9000/api/users/",
      type: "post",
      data: user,
      success: window.location.href="http://localhost:3000/"
    })
  })

  $("body").on("click", ".delete_product", function(){
    event.preventDefault();
    console.log($(this).attr("id"));
    console.log(this);
    $.ajax({
      url: "http://localhost:9000/api/products/" + $(this).attr("id"),
      type: "delete",
      success: window.location.href="http://localhost:3000/"
    });
  })

});