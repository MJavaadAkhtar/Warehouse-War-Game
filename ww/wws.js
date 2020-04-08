// Web socket initialization and functions.
'use strict';
require('./static-content/lib/constants.js');
let WebSocketServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./ww_node.js');

require('./static-content/lib/constants.js');
var port = wwPort; // The port number imported from constants.js
const Stage = require('./Game Components/Stage.js');

var clients={}; // {username: ws object}
var clientsInLobby=[]; // [usernames]
var clientsInGame = []; // [usernames]
var HSscore = {};
var latestMove;
var losers = [];



let wss = new WebSocketServer({ server: server });
server.on('request', app);

wss.on('close', function () {
	console.log('disconnected');
});




var stage = new Stage(20, 20, "stage", "score", "E", wss);
stage.initialize();

// Updating stage and monsters movement every 0.7 seconds
setInterval(function () {
	if (clientsInGame.length != 0){
		stage.moveMonsters(latestMove);
		if (stage.getNumPlayers() != 0){
			stage.displayUpdate();
		}else{
			stage.getNumPlayers();
		}
		wss.sendStage();
		// wss.sendScores();
	}
}, 700);


// when someone new connects, listen for their messages, and broadcast if they send
wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		var msg = JSON.parse(message);
		switch (msg.type) {
			case "join":
				if (!clients[msg.user]) {
					clients[msg.user] = ws;
				} else{
					var otherws = clients[msg.user];
					wss.forceLogout(otherws);
					clients[msg.user] = ws;
				}
				break;

			case "chat":
				wss.broadcastChat(msg.user + ": " + msg.msg);
				break;

			case "page-change":
				removeClientFromAllPages(msg.user);
				if (msg.page === "lobby") {

					// wss.exitGame(msg.user);

					clientsInLobby.push(msg.user);
					while (losers.length > 0) {
						console.log(losers);
						losers.pop();
					}
				} else if (msg.page == "logout") {
					delete clients[msg.user];
					while (losers.length > 0) {
						losers.pop();
					}
				}
				break;

			case "game":
				switch (msg.action){
					case "start":
						removeClientFromAllPages(msg.user);
						wss.enterGame(msg.user);
						break;
					
					case "move":
						if (losers.indexOf(msg.user)==-1){
							latestMove = msg.user;
							stage.movePlayer(msg.user, msg.move);
							wss.sendStage();
							break;
						}else{
							wss.sendStage();
							break;
						}
				}
				break;
		}
	});
});

// Function to broad cast messages in the chat lobby
wss.broadcastChat = function(message){
	var augmentedMsg = { type: "chat", msg: message}
	for(let username of clientsInLobby){ 
		var ws = clients[username];
		ws.send(JSON.stringify(augmentedMsg)); 
	}
}

// Function to logout a user
wss.forceLogout = function(ws) {
	var augmentedMsg = { type: "logout" }; 
	ws.send(JSON.stringify(augmentedMsg));
	ws.close();
}

// function for Sending a server-side rendered stage 
wss.sendStage = function(){
	var ws;
	if (stage.getNumPlayers() != 0){	
		stage.displayUpdate();
	}
	if (clientsInGame.length !== stage.getClients().length) {
		// console.log(stage.getClients());
	}
	var removeInds = [];
	for (var i =0; i < clientsInGame.length; i++) {
		var client = clientsInGame[i];
		var ws = clients[client];
		if (stage.getClients().indexOf(client) > -1) {			
			var augmentedMsg = { type: "game", state: stage.getStage(), score: stage.getScore()};
			ws.send(JSON.stringify(augmentedMsg));
		} else {
			losers.push(client);
			var augmentedMsg = { type: "lose-game", user:client,state: stage.getStage(), score: stage.getScore() };
			ws.send(JSON.stringify(augmentedMsg));
			// removeClientFromAllPages(msg.user);
		}
	}
}

//enter a client to game
wss.enterGame = function(username){
	HSscore[username] = 0;
	clientsInGame.push(username);
	stage.addPlayer(username);
	var augmentedMsg = { type: "game", state: stage.getStage(), score: stage.getScore()};
	var i;
	for (i =0; i < clientsInGame.length; i++) {
		var client = clientsInGame[i];
		var ws = clients[client];
		ws.send(JSON.stringify(augmentedMsg));
	}
	wss.sendStage();

}

//exit a client in the game
wss.exitGame = (username) => {
	HSscore[username] = 0;
	let ind = clientsInGame.indexOf(username)
	if (ind > -1) {
		clientsInGame.splice(ind, 1);
	}
	// clientsInGame.push(username);


	// stage.addPlayer(username);
	stage.removePlayer(username) 

	var augmentedMsg = { type: "chat", state: stage.getStage(), score: stage.getScore() };
	var ws = clients[username];
	ws.send(JSON.stringify(augmentedMsg));

}

// Send updated scores to all players in game
wss.sendScores = function() {
	for (var i = 0; i < stage.players.length; i++){
		var username = stage.players[i].username;
		var score = stage.players[i].score;
		var ws = clients[username];
		augmentedMsg = { type: "score", score: score};
		ws.send(JSON.stringify(augmentedMsg));
	}
}

// Removing client from everywhere
function removeClientFromAllPages(username) {
	var lobbyIndex = clientsInLobby.indexOf(username);
	if (lobbyIndex > -1) {
		clientsInLobby.splice(lobbyIndex, 1);
	}
	var gameIndex = clientsInGame.indexOf(username);
	if (gameIndex > -1) {
		stage.removePlayer(username);
		clientsInGame.splice(gameIndex, 1);
	}

	console.log(clientsInGame.length)
}

server.listen(wwPort, ()=>{
	console.log('Example app listening on port ' + wwPort + '!');
});