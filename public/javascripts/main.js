$("a").click(function (event){
	event.preventDefault();
    $('#index').hide();
    $('#fullthread').show();
    $.post( "/test", {ID:$(this).attr("href")}, function ( data ) {
			for(var message in data){
				if(data[message].body && (data[message].body).indexOf("http") >= 0){
					if(data[message].senderName == "Conor Igoe"){
						text = "<div id='me'>" + data[message].body + "</div>";
						$("#fullthread").append(text);
					}
					else{
						text = "<div id='you'>" + data[message].body + "</div>";
						$("#fullthread").append(text);
					}
					$("#fullthread").append("<br/>");
				}
			}
			$("#fullthread").append("<button id='back'>Go Back</button>");
			$("#back").click(function (event){
				$("#fullthread").empty();
				$("#index").show();
			});
	});
});

$("#logout").click(function (event ){
	event.preventDefault();
	$("body").empty();
	$.get("/logout", function (data){
		$("body").append(data);
	});
});