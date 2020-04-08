//Game functions
function showGame() {

	setupGame();
	startGame();
	if (running){
		document.onkeydown = checkKey;
		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '38' || e.keyCode == '87') {
				makeMove("N");
			}
			else if (e.keyCode == '40' || e.keyCode == '88') {
				makeMove("S");
			}
			else if (e.keyCode == '37' || e.keyCode == '65') {
				makeMove("W");
			}
			else if (e.keyCode == '39' || e.keyCode == '68') {
				makeMove("E");
			}
			else if (e.keyCode == '81') {
				makeMove("NW");
			}
			else if (e.keyCode == '69') {
				makeMove("NE");
			}
			else if (e.keyCode == '67') {
				makeMove("SE");
			}
			else if (e.keyCode == '90') {
				makeMove("SW");
			}
		}
	}
}

function setupGame(str) {
	// stage=null;
	let starting = false;
	interval = null;
	running = true;
	dif = "";

	stage = new Stage(20, 20, "stage", "score", "E");
	stage.initialize();
}
function resumeGame(){
	running = true;
	// $("#Pause").show();

	// $("#Resume").hide();
}

// function startGame() {
// 	starting = true;
// 	// $("#s").show();
// 	// $("#cntrl").show();
// 	// $("#buttons").hide();
// 	// //$("#password").hide();
// 	// $("#tl").hide();
// 	// $("#L").hide();
// 	// $("#Pause").show();
// 	// $("#restart").show();
// 	// $("#gameStart").hide();
// 	// $("score_b").show();

// 	stage.startGame();
// 	setInterval(function () {
// 		// alert("doing");
// 		if (running){
// 		stage.updateThingy();
// 		stage.displayUpdate();}
// 	}, 1000);
// }

function pauseGame() {
	running = false;
	// $("#Pause").hide();
	// $("#Resume").show();
}
