$("a").click(function (event){
	event.preventDefault();
    $('#index').hide();
    $('#fullthread').show();
    $.post( "/fullThread", {ID:$(this).attr("href")}, function ( data ) {
			for(var message in data){
				if(data[message].body && (data[message].body).indexOf("http") >= 0){
					if(data[message].senderName == "Conor Igoe"){
						text = ("<a href='" + data[message].body + "'><div id='me'>" + data[message].body + "</div></a>");
						$("#fullthread").append(text);
					}
					else{
						text = "<a href='" + data[message].body + "'><div id='you'>" + data[message].body + "</div></a>";
						$("#fullthread").append(text);
					}
					$("#fullthread").append("<br/>");
				}
			}

			$("#fullthread a").each(function (integer, element){
				$(this).children("div").append("<h1>" + element.hostname + "</h1>");
			});

			$("#fullthread").append("<button id='back'>Go Back</button>");
			$("#back").click(function (event){
				$("#fullthread").empty();
				$("#index").show();
			});
	});
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