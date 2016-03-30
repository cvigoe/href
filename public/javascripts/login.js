$(document).ready(function(){
  $("button").click(function (event){
    event.preventDefault();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    $('#login').empty();
    $.post("/index", {email: email, password: password}, function( data ) {
			$("#index").append(data);
    });
  });
});