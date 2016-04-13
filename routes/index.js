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
	// console.log("ORIGINAL FORMAT".red);
	// console.log(array);
	// console.log("ORIGINAL FORMAT".red);
	if(err) {
		response.send(false);
		return console.error(err);
	}
	console.log("Got Thread List:".blue);
	for(var i in array){
		ID = array[i].threadID;
		threads[i] = {  "Participants": array[i].participantIDs,
						"ThreadID": ID };
	}
	// console.log("Before conversion:".blue);
	// console.log(threads);
	threads.convert();
};

function convert(){
	console.log("Attempting to convert threads object...".blue);
	threadsArray = this;

	temp = [];

	for(var j in threadsArray){
		for(var k in threadsArray[j]["Participants"]){
			temp.push(threadsArray[j]["Participants"][k]);
		}
	}
	storedAPI.getUserInfo(temp, getUserInfoCallback);
}

function getUserInfoCallback (error, object){
	if(error) {
		response.send(false);
		return console.error(error);
	}
	for(var l in threadsArray){
		for(var m in threadsArray[l]){
			for(var x in threadsArray[l][m]){
				if(threadsArray[l][m][x] === current_user_ID){
					threadsArray[l][m][x] = "me";
				} else{
					threadsArray[l][m][x] = object[threadsArray[l][m][x]];
				}
			}
		}
	}
	console.log("SENDING RESPONSE".green);
	// console.log(JSON.parse(JSON.stringify(threadsArray)));
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
	// console.log("ID".green + req.body.ID);
	ID = req.body.ID;
	storedAPI.getThreadHistory(ID, 1, 10000, null, function (error, history){
		if(error){
			res.render("login", {firstTime: false});
			return console.error(error)
		}
		console.log("Got Thread History, trimming...".blue);
		trimmedHistory = [];
		trim(history, res);
	});
}

// Logout Page

function getLogoutPage (req, res, next){
	storedAPI.logout(function (error){
		res.render("login",{firstTime: false });
	});
}

function trim (history, res){
	for (var message in history){
		if(history[message].body == undefined){
			continue;
		}
		if(history[message].body.indexOf("http") >= 0){
			if(history[message].senderID == "fbid:" + current_user_ID){
				history[message].senderName = "me";
			}
			history[message].body = urlify(history[message].body);
			trimmedHistory.push(history[message]);
		}
	}

	console.log("Trimmed history, now sending...".blue);

	res.send(trimmedHistory);
}

function urlify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a id="nostyle" href="' + url + '">' + url + '</a>';
    });
}

module.exports = router;