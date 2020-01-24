// Web socket stuff
require('./static-content/lib/constants.js');
port = wwPort;

const Box = require('./Box');
const AllMonsters = require('./Monster.js');
const Monsters = AllMonsters.Monsters;
const SmartMonsters = AllMonsters.SmartMonsters;
const Stage = require('./Stage.js');

var clients={}; // {username: ws object}
var clientsInLobby=[]; // [usernames]
var clientsInGame = []; // [usernames]
var HSscore = {};
var latestMove;
var losers = [];

var stage = new Stage(20, 20, "stage", "score", "E", wss);
stage.initialize();

// var stages = {};
// stages[1] = stage;

setInterval(function () {
	if (clientsInGame.length != 0){
		// console.log("yoda1");
		stage.moveMonsters(latestMove);
		// console.log("yoda");
		if (stage.getNumPlayers() != 0){
			stage.displayUpdate();
		}else{
			stage.getNumPlayers();
		}
		wss.sendStage();
		// wss.sendScores();
	}
}, 700);


var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: wwWsPort});

wss.on('close', function() {
    console.log('disconnected');
});

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

wss.broadcastChat = function(message){
	var augmentedMsg = { type: "chat", msg: message}
	for(let username of clientsInLobby){ 
		var ws = clients[username];
		// console.log(message);
		ws.send(JSON.stringify(augmentedMsg)); 
	}
}

wss.forceLogout = function(ws) {
	var augmentedMsg = { type: "logout" }; 
	ws.send(JSON.stringify(augmentedMsg));
	ws.close();
}

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
			//console.log(client);
			var augmentedMsg = { type: "game", state: stage.getStage(), score: stage.getScore()};
			// console.log("sending score " + clientScore + " to client " + client);
			ws.send(JSON.stringify(augmentedMsg));
		} else {
			// console.log(client + " lost");
			// var augmentedMsg = { type: "lose-game"};
			//removeInds.push(i);
			//removeClientFromAllPages(client);
			losers.push(client);
			// ws.send(JSON.stringify(augmentedMsg));
			var augmentedMsg = { type: "lose-game", user:client,state: stage.getStage(), score: stage.getScore() };
			// console.log("sending score " + clientScore + " to client " + client);
			ws.send(JSON.stringify(augmentedMsg));
			// removeClientFromAllPages(msg.user);
		
			// front-end will move client to lobby
		}
	}

	// for (var i in removeInds) {
	// 	console.log("comes here");
	// 	clientsInGame.splice(i,1);
	// }
}

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