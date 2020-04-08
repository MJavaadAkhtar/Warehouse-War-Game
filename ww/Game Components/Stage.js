const Box = require('./Box.js');
const AllMonsters = require('./Monster.js');
const Player = require('./Player.js');
const Monsters = AllMonsters.Monsters;
const SmartMonsters = AllMonsters.SmartMonsters;

module.exports = class Stage{
	constructor(width, height, stageElementID,scorel, str){
		this.actors=[]; // all actors on this stage (monters, player, boxes, ...)
		this.clientUsernames = [];
		this.players = {}; // all human Player objects { username: Player}
		this.monsters = 0;

		// the logical width and height of the stage
		this.width=width;
		this.height=height;
		this.gameOver = false;

		// the element containing the visual representation of the stage
		this.stageElementID=stageElementID;

		// Following URIs are relative to the file that will RECEIVE this html (i.e. client side code in static-content/)
		this.blankImageSrc = "./icons/blank.gif";
		this.monsterImageSrc = "./icons/face-devil-grin-24.png";
		this.playerImageSrc = "./icons/face-cool-24.png"; 
		this.boxImageSrc = "./icons/emblem-package-2-24.png";
		this.wallImageSrc = "./icons/wall.jpeg";
		this.smart = "./icons/Slimy-Blue-Monster.png";
		this.str = str;

		//Hashmap to store some stuff
		this.hashing = {};
		// this.score = 1000;
		this.s = "";

		this.HS = {}
	}
	
	isGameOver(){
		return (this.actors.length == 0);
	}
	
	initialize() {
		this.monsters = 0;
		this.hashing = {}; this.actors = [];
		var boxnumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 2);
		var m = "";
		if (this.str == "E"){
			var MonstersNumber;
			boxnumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 2);
			MonstersNumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 100);
			this.monsters  = MonstersNumber+1;//alert("comes easy "+this.monsters.toString());
		}else if (this.str == "M"){
			boxnumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 2);
			MonstersNumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 40);
			this.monsters  = MonstersNumber+1;//alert("comes medium "+this.monsters.toString());
		}else{
			boxnumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 4);
			MonstersNumber = Math.floor(((this.width * this.height) - ((this.width + this.height) * 2)) / 20);
			this.monsters  = MonstersNumber+1;//alert("comes hard "+this.monsters.toString());
		}

		var k;
		for (k = 0; k <= boxnumber; k++) {
			var x = Math.floor((Math.random() * this.height - 1) + 1);
			var y = Math.floor((Math.random() * this.width - 1) + 1);

			var stringin;
			stringin = x.toString() + "," + y.toString();
			while (stringin in this.hashing) {
				x = Math.floor((Math.random() * this.height) + 1);
				y = Math.floor((Math.random() * this.width) + 1);
				if (x != Math.ceil(this.height / 2) && y != Math.ceil(this.width / 2)) {
					stringin = x.toString() + "," + y.toString();
				}
			}
			var box = new Box(x, y, this.boxImageSrc, this);
			this.hashing[stringin] = box;
		}


		//this is adding the mosnter to the hashmaps
		for (k = 0; k <= MonstersNumber; k++) {
			var x = Math.floor((Math.random() * this.height - 1) + 1);
			var y = Math.floor((Math.random() * this.width - 1) + 1);
			stringin = x.toString() + "," + y.toString();
			while (stringin in this.hashing) {
				x = Math.floor((Math.random() * this.height) + 1);
				y = Math.floor((Math.random() * this.width) + 1);
				stringin = x.toString() + "," + y.toString();
			}
			if (k == MonstersNumber-1){
				var Monster = new Monsters(x,y, this.smart, this);
				//Monster = new Monsters(x,y, this.monsterImageSrc, this);
			}else{
			var Monster = new Monsters(x,y, this.monsterImageSrc, this);}
			this.hashing[stringin] = Monster;
		}
		x = 9;y = 10;
		var box = new Box(x,y, this.boxImageSrc, this);stringin =x.toString()+","+y.toString();
				this.hashing[stringin] = box; x =5, y = 10;stringin =x.toString()+","+y.toString();

		this.update();
	}

	addPlayer(username) {

		this.clientUsernames.push(username);

		var x = Math.floor((Math.random() * this.height) + 1);
		var y = Math.floor((Math.random() * this.width) + 1);
		if (x == this.width){
			x = this.width-1;
		}
		if (y == this.height) {
			y = this.height - 1;
		}
		var stringin = x.toString() + "," + y.toString();
		while (stringin in this.hashing) {
			x = Math.floor((Math.random() * this.height) + 1);
			y = Math.floor((Math.random() * this.width) + 1);
			if (x == this.width) {
				x = this.width - 1;
			}
			if (y == this.height) {
				y = this.height - 1;
			}
			if (x !=0  && y != 0 && x != this.height-1 && y != this.width-1) {
				stringin = x.toString() + "," + y.toString();
			}
		}
		var player = new Player(x, y, this.playerImageSrc, this, username);
		this.players[username] = player;
		this.hashing[stringin] = this.players[username];
		this.actors.push(this.players[username]);
		// this.track.push(this.players[username]);

		this.update();
	}

	removePlayer(username) {

		var usernameInd = this.clientUsernames.indexOf(username);
		if (usernameInd > -1) {
			this.clientUsernames.splice(usernameInd, 1);
		}
		if (this.players[username]) {
			this.HS[username] = this.players[username].score;
			var player = this.players[username];
			delete this.hashing[player.x.toString() + "," + player.y.toString()];
			delete this.players[username];
			// console.log(this.hashing[])
			var playerInd = this.actors.indexOf(player);
			if (playerInd > -1){
				this.actors.splice(playerInd, 1);
			}
		}
		this.update();
	}

	getClients(){
		return this.clientUsernames;
	}

	getNumPlayers() {
		return Object.keys(this.players).length;
	}

	getPlayers() {
		return this.players;
	}

	containsPlayer(username){
		return this.players[username] != undefined;
	}
	
	movePlayer(username, move) {
		var player = this.players[username];
		delete this.hashing[player.x.toString() + "," + player.y.toString()];
		player.makeMove(move);
		this.hashing[player.x.toString() + "," + player.y.toString()] = player;
	}

	moveMonsters(user){
		for (var i in this.hashing){
			if (this.hashing[i].isMonster) {
				if (user in this.players){
					this.hashing[i].getRandMove(this.players[user]);
				}else{
					this.hashing[i].getRandMove();
				}
				
			}
		}
	}
	getScore(){
		// var HS = {};
		for (var player in this.players){
			this.HS[player] = this.players[player].score;
		}
		return this.HS;
	}
	getScore(){
		// var HS = {};
		for (var player in this.players){
			this.HS[player] = this.players[player].score;
		}
		return this.HS;
	}

	getScore(){
		// var HS = {};
		for (var player in this.players){
			this.HS[player] = this.players[player].score;
		}
		return this.HS;
	}

	update() {		
		var s = '<table class = "box">';
		var stringy = "";
		var i;
		for (i = 0; i < this.height; i++) {
			s += '<tr class = "box">';
			var j;
			for (j = 0; j < this.width; j++) {
				s += '<td >';
				if (j == 0 || i == 0 || j == this.width - 1 || i == this.height - 1) {
					s += "<img src= '" + this.wallImageSrc + "' id = " + i.toString() + "," + j.toString() + 'height="20" width="20">';
				}
				else if ((i.toString() + "," + j.toString()) in this.hashing) {
					s += "<img src= '" + this.hashing[(i.toString() + "," + j.toString())].img + "' id = " + i.toString() +
						"," + j.toString() + ' height="20" width="20">';
				}
				else {
					s += "<img src= '" + this.blankImageSrc + "' id = " + i.toString() + "," + j.toString() + ' height="20" width="20">';
				}
				s += "</td>";
			}
			s += "</tr>";
		}
		s += "</table>";
		this.s = s;
	}

	displayUpdate() {
		if (this.getNumPlayers() === 0) {
			this.initialize();

		} else {
			this.update();
		}
	}

	getStage () {
		return this.s;
	}
}