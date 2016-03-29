var login = require("facebook-chat-api");
var express = require("express");
var colors = require("colors");

var router = express.Router();
var threads = {};
threads.convert = convert;
var ID;
var test;
var hello;
var temp = [];
var response;
/* GET home page. */
router.get('/home', getHomePage);
router.get('/', getLoginPage);
router.post('/test', getTestPage);
router.get('/logout', getLogoutPage);

function getLogoutPage (req, res, next){
	test.logout(function (error){
		res.render("login",{firstTime: false });
	});
}

function getLoginPage (req, res, next){
	res.render("login");
}

function getTestPage (req, res, next){
	console.log("Got Test Page, attempting to get thread history...".blue);
	console.log("ID".green + req.body.ID);
	ID = req.body.ID;
	test.getThreadHistory(ID, 1, 1000, null, function (error, history){
		console.log("Got Thread History, now sending...".blue);
		res.send(history);
	});
}

function getHomePage(req, res, next){
	console.log("Got Home Page, attempting to log in using facebook-chat-api...".blue);
	response = res;
	console.log(req);
	console.log(req.email);
	login({email: "conorivincentigoe@hotmail.com", password: "Chocolate101"}, loginCallback);
};

function loginCallback(err, api){
	if(err) return console.error(err);
	console.log("Logged in with facebook-chat-api, attempting to get Thread List...".blue);
	test = api;
	api.getThreadList(1, 50, getThreadListCallback);
};

function getThreadListCallback(err, array){
	if(err) return console.error(err);
	console.log("Got Thread List:".blue);
	for(var i in array){
		ID = array[i].threadID;
		threads[ID] = array[i].participantIDs;
	}
	console.log("Before conversion:".blue);
	console.log(threads);
	threads.convert();
};

function convert(){
	console.log("Attempting to convert threads object...".blue);
	hello = this;

	for(var j in hello){
		for(var k in hello[j]){
			temp.push(hello[j][k]);
		}
	}

	test.getUserInfo(temp, getUserInfoCallback);
}

function getUserInfoCallback (error, object){
	console.log(object);
	for(var l in hello){
		for(var m in hello[l]){
			hello[l][m] = object[hello[l][m]];
		}
	}
	console.log("SENDING RESPONSE".green);
	response.render("index", { array: JSON.stringify(hello, replacer) });
}

function replacer(key, value) {
	if (value === "convert") {
		return undefined;
	}
	return value;
}

module.exports = router;