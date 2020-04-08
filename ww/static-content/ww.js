//------------------------------------------------------------------------------------------------------------------------------------------------------------
// This is executed when the document is ready (the DOM for this document is loaded)
var lose = false;

$(function () {
	// Setup all events here and display the appropriate UI
	socket = new WebSocket(global.wwWsURL);
	socket.onopen = function (event) {
		console.log("connected");
	}
	socket.onclose = function (event) {
		// alert("closed code: " + event.code + " reason: " +event.reason + " wasClean: "+event.wasClean);
	}
	socket.onmessage = function (event) {
		data = JSON.parse(event.data);
		switch (data.type) {
			case "chat":
				displayMessage(data.msg);
				break;
			case "game":
				$("#stage").html(data.state);
				$("#HS").html("Scores:");
				//userInHS[data.user] = data.score;
				for (var users in data.score) {
					// setHighScores(users,data.score[users]);
					$("#HS").append("<br/>" + users + " : " + data.score[users]);
				}
				break;
			case "lose-game":
				// console.log("lose");
				$("#lossMsg").html("You lost!");
				
				// alert("YOU LOSE!!!");
				$("#stage").html(data.state);
				$("#HS").html("Scores:");
				//userInHS[data.user] = data.score;
				for (var users in data.score) {
					console.log(data.score[users])
					setHighScores(users, data.score[users]);
					$("#HS").append("<br/>" + users + " : " + data.score[users]);
				}
				// sendClientToPage("lobby");
				break;

			case "logout":
				console.log("here")
				currentUsername = "";
				currentPassword = "";
				window.location.reload();
				break;
		}
	}
});

//-----------------------------------------------------------------------------------------------------------------------------------
// TO Web socket server

function sendMessage(username, msg) {
	var augmentedMsg = { type: "chat", user: username, msg: msg };
	socket.send(JSON.stringify(augmentedMsg));
}

function sendClientToPage(pageName) {



	var augmentedMsg = { type: "page-change", user: currentUsername, page: pageName };
	socket.send(JSON.stringify(augmentedMsg));
}

function addActiveClient() {
	var augmentedMsg = { type: "join", user: currentUsername };
	socket.send(JSON.stringify(augmentedMsg));
}

function enterGame() {
	var augmentedMsg = { type: "game", action: "start", user: currentUsername };
	socket.send(JSON.stringify(augmentedMsg));
}

//-----------------------------------------------------------------------------------------------------------------------------------
// FROM Web socket server
function displayMessage(msg) {
	$('#messages').append("<br/>" + msg);
}

// ---------------------------------------------------------------------------------------
function move() {
	if (!lose) {
		document.onkeydown = checkKey;
		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '38' || e.keyCode == '87') {
				var augmentedMsg = { type: "game", action: "move", move: "N", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '40' || e.keyCode == '88') {
				var augmentedMsg = {
					type: "game", action: "move", move: "S", user: currentUsername
				};
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '37' || e.keyCode == '65') {
				var augmentedMsg = { type: "game", action: "move", move: "W", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '39' || e.keyCode == '68') {
				var augmentedMsg = { type: "game", action: "move", move: "E", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '81') {
				var augmentedMsg = { type: "game", action: "move", move: "NW", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '69') {
				var augmentedMsg = { type: "game", action: "move", move: "NE", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '67') {
				var augmentedMsg = { type: "game", action: "move", move: "SE", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
			else if (e.keyCode == '90') {
				var augmentedMsg = { type: "game", action: "move", move: "SW", user: currentUsername };
				socket.send(JSON.stringify(augmentedMsg));
			}
		}
	}
}


//UI Navigation

var currentUsername = "";
var currentPassword = "";

function login(user, pass) {
	return $.ajax({
		method: "POST",
		url: "/api/registeredUsers/",
		data: {
			username: user,
			password: pass
		}
	}).done(function (data) {
		currentUsername = user;
		currentPassword = pass;
		addActiveClient();
	});
}

function register(username, password, name) {
	return $.ajax({
		method: "POST", // POST for sending password
		url: "/api/registeredUsers/" + username + "/",
		data: {
			username: username,
			password: password,
			name: name
		}
	}).done(function (data) {
		currentUsername = username;
		currentPassword = password;
		addActiveClient();
	});
}

function getHighScores() {
	return $.ajax({
		method: "GET",
		url: "/api/highScores/"
	});
}

function logout() {
	var msg = { type: "page-change", user: currentUsername, page: "logout" };
	socket.send(JSON.stringify(msg));
	currentUsername = "";
	currentPassword = "";
	window.location.reload();
}


function makePrivate(bool) {
	if (bool) {
		var action = "make-private";
	} else {
		var action = "make-unprivate";
	}
	$.ajax({
		method: "PUT",
		url: "/api/highScores/" + currentUsername + "/",
		data: {
			username: currentUsername,
			password: currentPassword,
			score: "", //irrelevant
			action: action
		}
	}).done(function (data) {
		console.log("User privacy setting changed");
	}).fail(function (xhr) {
		console.log("Could not change privacy setting");
	});
}

function setHighScores(username, score) {

	console.log(username, score);

	return $.ajax({
		method: "POST",
		url: "/api/highScoresUpdate/" + username + "/",
		data: {
			scores: score
		}
	});
}

function getUserHighScore() {
	return $.ajax({
		method: "GET",
		url: "/api/highScores/" + currentUsername + "/"
	});
}

function getNameOfUser() {
	return $.ajax({
		method: "POST",
		url: "/api/registeredUsers/" + currentUsername + "/name/",
		data: {
			username: currentUsername,
			password: currentPassword
		}
	});
}


// function editName(){
// 	var newName = $("#editNameField").val();

// 	$.ajax({
// 		method: "PUT",
// 		url: "/api/registeredUsers/" + currentUsername + "/name/",
// 		data: {
// 			username: currentUsername,
// 			password: currentPassword,
// 			name: newName
// 		}
// 	}).done(function (data) {
// 		$("#editName").hide();
// 		displayNameOnProfile();
// 	}).fail(function(xhr) {
// 		// Value of error doesn't matter to user, just print:
// 		var result = JSON.parse(xhr.responseText);
// 		// $("#profileError").text(result.error);
// 		// $("#profileError").show();
// 	})
// }

// function deleteProfile(){

// 	$.ajax({
// 		method: "DELETE",
// 		url: "/api/registeredUsers/" + currentUsername + "/",
// 		data: {
// 			username: currentUsername,
// 			password: currentPassword
// 		}
// 	}).done( function(data) {
// 		logout();
// 	}).fail(function (xhr) {
// 		var result = JSON.parse(xhr.responseText);
// 		// $("#profileError").text(result.error);
// 		// $("#profileError").show();
// 	});
// }

function getUserAvatar() {
	return $.ajax({
		method: "GET",
		url: "/api/registeredUsers/" + currentUsername + "/avatar/"
	});
}


//-----------------------------------------------------------------------------------------------------------------------------------


window.onbeforeunload = () => {
	window.alert("logging out");
	logout();
}