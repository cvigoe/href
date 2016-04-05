$(document).ready(function(){
  $("#login_btn").hover(function(){
    $("#login_btn").css("background", "#4DA1DE");
  }, function(){
    $("#login_btn").css("background", "#53ABEA");
  });

  $("#login_btn").click(function(){
    $("#login_form").submit();
  });

  $("#login_form").submit(function (event){
    event.preventDefault();
    // event.stopPropagation();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    $('#login').hide();
    $("#login_btn").hide();
    $("body").append("<h1 id='plead'>Bear with me for about 20 seconds...<h1>");
    $.post("/index", {email: email, password: password}, function( data ) {
      $("#plead").hide();
      if (data === false){
        $("#flash").html("<h3>Please check your username and password</h3>");
        $("#login").show();
        $("#login_btn").show();
      }
      else {
        $("#index").append(data);
      }
    });
  });
});