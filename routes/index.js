// Requirements

var login = require("facebook-chat-api");
var express = require("express");
var colors = require("colors");

// Variables

var router = express.Router();
var threads = [];
threads.convert = convert;
var ID;
var storedAPI;
var threadsArray;
var temp = [];
var response;
var current_user_ID;
var trimmedHistory=[];

// Routing

router.get('/', getLoginPage);
router.post('/index', getIndexPage);
router.post('/fullThread', getFullThreadPage);
router.get('/logout', getLogoutPage);

// Login Page

function getLoginPage (req, res, next){
	res.render("login");
}

// Index Page
//     1) login()
//     2) getThreadList()
//     3) 

function getIndexPage(req, res, next){
	console.log("Got Index Page, attempting to log in using facebook-chat-api...".blue);
	response = res;
	console.log("Email:".red);
	console.log("    " + req.body.email);
	console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^".red);
	threads = {};
	threads.convert = convert;
	login({email: req.body.email, password: req.body.password}, loginCallback);
};

function loginCallback(err, api){
	if(err) {
		if(err.error == "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify." || err.error == "Couldn't login. Facebook might have blocked this account. Please login with a browser or enable the option 'forceLogin' and try again."){
			response.send("1");
			return console.error(err);
		}
		else{
			response.send("2");
			return console.error(err);
		}
	}

	current_user_ID = api.getCurrentUserID();
	console.log("Current user:".green);
	console.log("     " + current_user_ID);
	console.log("Logged in with facebook-chat-api, attempting to get Thread List...".blue);
	storedAPI = api;
	api.getThreadList(1, 300, getThreadListCallback);
};

function getThreadListCallback(err, array){
	if(err) {
		response.send(false);
		return console.error(err);
	}
	console.log("Got Thread List:".blue);

	// Tidy up inconsistent formatting for FB IDs
	for(var i in array){
		ID = array[i].threadID;
		if(ID.indexOf("id.") >= 0){
			ID = ID.replace("id.", "");
		}

		// Add each thread in array[] to threads[], getting rid of unneccessary data & simplifying structure for later
		threads[i] = {  "Participants": array[i].participantIDs,
						"ThreadID": ID };
	}

	// Convert particpant IDs to FirstName LastName format
	threads.convert();
};

function convert(){
	console.log("Attempting to convert threads object...".blue);
	threadsArray = this;

	// temp[] used to temporarily store the list of particpant IDs that need to be converted to names
	temp = [];

	for(var j in threadsArray){
		for(var k in threadsArray[j]["Participants"]){
			temp.push(threadsArray[j]["Participants"][k]);
		}
	}

	// use API to get names
	storedAPI.getUserInfo(temp, getUserInfoCallback);
}

function getUserInfoCallback (error, object){
	if(error) {
		response.send(false);
		return console.error(error);
	}

	// Replace IDs with correct names
	for(var l in threadsArray){
		for(var m in threadsArray[l]){
			for(var x in threadsArray[l][m]){
				if(threadsArray[l][m][x] === current_user_ID){
					// If current user's ID is encountered (they message themselves), flag it by using different formatting
					threadsArray[l][m][x] = "me";
				} else if(!object[threadsArray[l][m][x]]){
					// If no name was found for user ID, list as unkown user
					threadsArray[l][m][x] =  {
       											"name": "Unknown User",
        										"firstName": "Unknown User",
      										};
				} else{
					// Otherwise, replace the ID with the name
					threadsArray[l][m][x] = object[threadsArray[l][m][x]];
				}
			}
		}
	}

	// Send response with threads array, now formatted simply and with user IDs replaced with names
	console.log("SENDING RESPONSE".green);
	response.render("index", { array: JSON.stringify(threadsArray, replacer) });
}

// Function to prevent the method from being passed to Jade in the threadsArray

function replacer(key, value) {
	if (value === "convert") {
		return undefined;
	}

	return value;
}

// Full Thread Page

function getFullThreadPage (req, res, next){
	console.log("Got Full Thread Page, attempting to get thread history...".blue);

	// Capture the ID of the selected thread
	ID = req.body.ID;

	// Get the histroy up to 10000 messages (pagination coming soon!) using the captured ID
	storedAPI.getThreadHistory(ID, 1, 10000, null, function (error, history){
		if(error){
			res.render("login", {firstTime: false});
			return console.error(error)
		}
		console.log("Got Thread History, trimming...".blue);

		// Trim all history apart from links using trim()
		trimmedHistory = [];
		trim(history, res);
	});
}

// Function to trim history of thread, leaving just the messages containing links

function trim (history, res){
	for (var message in history){
		if(history[message].body == undefined){
			continue;
		}

		// Regex pattern to be used on message body
		var patt = new RegExp(/(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig);

		if(patt.test(history[message].body)){
			if(history[message].senderID == "fbid:" + current_user_ID){
				history[message].senderName = "me";
			}
			history[message].body = urlify(history[message].body);
			trimmedHistory.push(history[message]);
		} else if(history[message].attachments.length > 0){
			if(history[message].senderID == "fbid:" + current_user_ID){
				history[message].senderName = "me";
			}
			for(i = 0; i < history[message].attachments.length; i++){
				if(history[message].attachments[i].type === "share" && history[message].attachments[i].facebookUrl != null){
					history[message].body += "<br/>";
					history[message].body += urlifyFB(history[message].attachments[i]);
					trimmedHistory.push(history[message]);
				}
			}
		}
	}

	console.log("Trimmed history, now sending...".blue);
	res.send(trimmedHistory);
}

function urlifyFB(attachment) {
    var urlRegex =/(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig
    return attachment.facebookUrl.replace(urlRegex, function(url) {
        return '<a class="nostyleFB" target="_blank" href="' + url + '">' + attachment.source + '</a>';
    });
}

function urlify(text) {
    var urlRegex =/(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig
    return text.replace(urlRegex, function(url) {
        return '<a class="nostyle" target="_blank" href="' + url + '">' + url + '</a>';
    });
}

// Logout Page

function getLogoutPage (req, res, next){
	storedAPI.logout(function (error){
		res.render("login",{firstTime: false });
	});
}

module.exports = router;