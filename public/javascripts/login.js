$(document).ready(function(){
	$("#login").append("<button>Log In</button>");

  $("button").click(function (event){
    event.preventDefault();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    $('#login').hide();
    $.get("/home", {email: email, password: password}, function( data ) {
			$("#index").append(data);
    });
  });
});