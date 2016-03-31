// Requirements

var login = require("facebook-chat-api");
var express = require("express");
var colors = require("colors");

// Variables

var router = express.Router();
var threads = {};
threads.convert = convert;
var ID;
var storedAPI;
var threadsObject;
var temp = [];
var response;

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
	login({email: req.body.email, password: req.body.password}, loginCallback);
};

function loginCallback(err, api){
	if(err) {
		response.send(false);
		return console.error(err);
	}
	console.log("Logged in with facebook-chat-api, attempting to get Thread List...".blue);
	storedAPI = api;
	api.getThreadList(1, 50, getThreadListCallback);
};

function getThreadListCallback(err, array){
	if(err) {
		response.send(false);
		return console.error(err);
	}
	console.log("Got Thread List:".blue);
	for(var i in array){
		ID = array[i].threadID;
		threads[ID] = array[i].participantIDs;
	}
	// console.log("Before conversion:".blue);
	// console.log(threads);
	threads.convert();
};

function convert(){
	console.log("Attempting to convert threads object...".blue);
	threadsObject = this;

	for(var j in threadsObject){
		for(var k in threadsObject[j]){
			temp.push(threadsObject[j][k]);
		}
	}

	storedAPI.getUserInfo(temp, getUserInfoCallback);
}

function getUserInfoCallback (error, object){
	if(error) {
		response.send(false);
		return console.error(err);
	}
	// console.log(object);
	for(var l in threadsObject){
		for(var m in threadsObject[l]){
			threadsObject[l][m] = object[threadsObject[l][m]];
		}
	}
	console.log("SENDING RESPONSE".green);
	response.render("index", { array: JSON.stringify(threadsObject, replacer) });
}

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
	storedAPI.getThreadHistory(ID, 1, 1000, null, function (error, history){
		console.log("Got Thread History, now sending...".blue);
		res.send(history);
	});
}

// Logout Page

function getLogoutPage (req, res, next){
	storedAPI.logout(function (error){
		res.render("login",{firstTime: false });
	});
}

module.exports = router;