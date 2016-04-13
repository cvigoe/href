$("a").click(function (event){
	event.preventDefault();
    $('#index').hide();
    $('#loading').show();
    $.post( "/fullThread", {ID:$(this).attr("href")}, function ( data ) {
			for(var message in data){
				if( true ){
					if(data[message].senderName == "me"){

						text = ("<div id='me'>" + data[message].body + "</div>");
						$("#fullthread").append(text);
						$("#fullthread").append("<h6>" + data[message].timestampDatetime + "</h6>");
					}
					else{
						text = ("<div id='you'>" + data[message].body + "</div>");
						$("#fullthread").append(text);
						$("#fullthread").append("<h6>" + data[message].timestampDatetime + "</h6>");
					}
					$("#fullthread").append("<br/>");
				}
			}

			$("#fullthread a").each(function (integer, element){
				$(this).parent("#you").append("<h1><span id='youspan'>" + element.hostname + "</span></h1>");
				$(this).parent("#me").append("<h1><span id='mespan'>" + element.hostname + "</span></h1>");
				$(this).parent("div").wrap("<a href='" + element.href + "'>" + "</a>");
			});
			underline();
			$("#fullthread").prepend("<button id='back'>Back</button><br/>");
			$('#loading').hide();
			$('#fullthread').show();

			$("html, body").animate({ scrollTop: $(document).height()-$(window).height() }, 0);


			$("#back").click(function (event){
				$("#fullthread").empty();
				window.scrollTo(0, 0);
				$("#index").show();
			});
	});
});

$("#thread").hover(function (event){
	$(this).children("#participant").children("#test2").attr("-webkit-text-stroke: ", "2.4px white;")
}, function (event){
	$(this).children("#participant").children("#test2").attr("-webkit-text-stroke: ", "2.4px aliceblue;")
});

$("#logout").hover(function (event){
	$("#logout").attr("src", "../images/logouth.png");
}, function (event){
	$("#logout").attr("src", "../images/logout.png");
});

$("#logout").click(function (event){
	event.preventDefault();
	$("body").empty();
	$.get("/logout", function (data){
		$("body").append(data);
	});
});

window.addEventListener("resize", underline, false);
window.addEventListener("load", underline, false);
underline();
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