$(function(){
//$(document).foundation();
$("#new_product").on("submit", function(){
  event.preventDefault();
  var product = {};
  product.bestBefore = Date.now();
  product.name = $(this).find("input[name=name]").val();
  product.quantity = $(this).find("input[name=quantity]").val();
  product.image = $(this).find("input[name=image]").val();
  console.log(product);
  $.ajax({
    url: "http://localhost:9000/api/products/",
    type: "post",
    data: product,
    success: window.location.href="http://localhost:3000/"
  })
});
});