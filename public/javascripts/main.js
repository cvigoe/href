$("a").click(function (event){
	event.preventDefault();
    $('#index').hide();
    $('#fullthread').show();
    $.post( "/fullThread", {ID:$(this).attr("href")}, function ( data ) {
			for(var message in data){
				if( true ){
					if(data[message].senderName == "Conor Igoe"){

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
				$(this).parent("div").append("<h1>" + element.hostname + "</h1>");
				$(this).parent("div").wrap("<a href='" + element.href + "'>" + "</a>");
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