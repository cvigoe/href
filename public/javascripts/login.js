$(document).ready(function(){
  $("#login_form").submit(function (event){
    event.preventDefault();
    // event.stopPropagation();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    $('#login').hide();
    $('#login').hide();
    $.post("/index", {email: email, password: password}, function( data ) {
      if (data === false){
        $("#flash").html("<h3>Please check your username and password</h3>");
        $("#login").show();
      }
      else {
        $("#index").append(data);
      }
    });
  });
});