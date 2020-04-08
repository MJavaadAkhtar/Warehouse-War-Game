var express = require('express');
var app = express();
require('./static-content/lib/constants.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('static-content')); // this directory has files to be returned

// Connecting with SQLITE3
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});
  

// Database interactions
//-------------------------------------
// Display high scores table on login page
app.get('/api/highScores/', function(req, res) {
	let sql = 'SELECT * FROM hiscores WHERE private=0 ORDER BY score DESC LIMIT 10;';
	db.all(sql, [], (err, rows) => {
		var result = {};
		if (err) {
			result["error"] = err.message;
			console.log(err.message);
			res.status(500); // Couldn't connect to high scores table
		} else {
			result["high-scores"] = [];
			rows.forEach((row) => {
				result["high-scores"].push({id: row.id, user: row.user, score: row.score});
				res.status(200);
			});
		}
		res.json(result);
	});
});

// Password encryption
var crypto = require('crypto');
function saltHashPassword(password) {
    var salt = crypto.randomBytes(8)
						.toString('hex') 
						.slice(0,16); // shorten to 16 chars

	passwordHash = combineHash(salt, password);
    return {
        salt: "" + salt,
        passwordHash: "" + passwordHash
    };
}

function combineHash(salt, password) {
	var hash = crypto.createHmac('sha512', salt); // use sha512 as hashing algo
    hash.update(password);
	return hash.digest('hex');
}


// Validate a user login
app.post('/api/registeredUsers/', function (req, res) {
	let sql = "SELECT salt, password FROM appuser WHERE username=?;";
	var username = "" + req.body.username;
	var password = "" + req.body.password;
	db.get(sql, [username], (err, row) => {
		var result = {};
		if (err) {
			result["error"] = "Cannot log in at the moment";
			res.status(500); //for some reason, could not query database
			console.log(err.message);
		} else {
			if (!row) {
				result["userError"] = "No such username exists";
				res.status(401);
			} else {
				hashedPass = combineHash("" + row.salt, password);
				if (!(hashedPass == row.password)) {
					result["passwordError"] = "Incorrect login information provided";
					res.status(500);
				}
				else {
					res.status(200);
				}
			}
		}
		res.json(result);
	});
});


// Registering a user and creating a database entry in hiscores
app.post('/api/registeredUsers/:user', function(req, res) {
	let sql = 'INSERT INTO appuser (username, password, salt, name) VALUES(?, ?, ?, ?);';
	var result = {};
	var password = "" + req.body.password;
	var username = "" + req.body.username;
	var name = "" + req.body.name;
	var saltAndPass = saltHashPassword(password);
	db.run(sql, [username, saltAndPass.passwordHash, saltAndPass.salt, name], (err) => {
		if (err) { 
			result["userError"] = "Username taken";
			res.status(401);
		} else {
			res.status(200);
		}
	});
	sql = 'INSERT INTO hiscores (username, name) VALUES(?, ?);';
	db.run(sql, [username, name], (err)=>{
		if (err){
			result["userError"] = "Username taken";
			// console.log(err.message);
			res.status(401);
		}else{
			res.status(200);
		}
		res.json(result);
	})
});


// Get a specific user's highest score
app.get('/api/highScores/:username/', function (req, res) {
	var username = "" + req.params.username;

	let sql = 'SELECT name, score FROM hiscores WHERE username=?;';
	db.get(sql, [username], (err, row) => {
		var result = {};
		if (err) {
			result["error"] = "Database retrieval error";
			res.status(500);
		} else {
			if (!row) {
				result["error"] = "You haven't played any games yet";
				// res.status(204); // No content
			} else {

				result["high-score"] = "" + row.score;
				res.status(200);
			}
		}
		res.json(result);
	});
});


// Get a specific user's real name
// POST because getting non-public information
app.post('/api/registeredUsers/:user/name/', function(req, res) {
	let sql = 'SELECT name FROM appuser WHERE username=?;';

	var username = "" + req.body.username;
	var password = "" + req.body.password;

	db.get(sql, [username], (err, row) => {
		result = {};
		valid = validateCreds(username, password);
		if (!valid) {
			result["error"] = "User is not authorized to get this information";
		} else {
			if (err){
				result["error"] = "Database retrieval error";
				console.log(err.message);
				res.status(500);
			} else {
				if (!row) {
					result["error"] = "Could not retrieve user's name";
					res.status(500); // For some reason, can't find user in appuser table
				} else {
					result["name"] = "" + row.name;
					res.status(200);
				}
			}
		}
		res.json(result);
	});
});


// Getting a certain user's data
app.post('/api/registeredUsers/:user/getData/', function (req, res) {
	let sql = 'SELECT username,name,avatarID FROM appuser WHERE username=?;';
	var username = "" + req.body.username;
	var password = "" + req.body.password;
	db.get(sql, [username], (err, row) => {
		result = {};
		valid = validateCreds(username, password);
		if (!valid) {
			result["error"] = "User is not authorized to get this information";
		} else {
			if (err) {
				result["error"] = "Database retrieval error";
				console.log(err.message);
				res.status(500);
			} else {
				if (!row) {
					result["error"] = "Could not retrieve user's name";
					res.status(500); // For some reason, can't find user in appuser table
				} else {
					result["name"] = "" + row.name;
					result["user_name"] = "" + row.username;
					result["avatar_ID"] = "" + row.avatarID;
					res.status(200);
				}
			}
		}
		res.json(result);
	});
});


// Edit a specific user's real name
app.put('/api/registeredUsers/:user/name/', function(req, res) {
	let sql = 'UPDATE appuser SET name = ? WHERE username=?;';

	var username = "" + req.body.username;
	var password = "" + req.body.password;
	var name = "" + req.body.name;

	db.run(sql, [name, username], (err) => {
		result = {};
		valid = validateCreds(username, password);
		if (!valid) {
			result["error"] = "User is not authorized to edit this information";
			res.status(401);
		} else {
			if (err){
				result["error"] = "Could not change name";
				console.log(err.message);
				// Username exists since this method is called from a user's own profile page,
				// and user is authorized, since validateLogin() worked, so must be server error
				res.status(500);
			} else {
				res.status(200);
			}
		}
		res.json(result);
	});
});



// Universal function to authorize requests
function validateCreds(username, password){
	let sql = "SELECT salt, password FROM appuser WHERE username=?;";
	db.get(sql, [username], (err, row) => {
		result = {};
		if (err) {
			return false;
		} else {
			if (!row) {
				return false;
			} else {
				hashedPass = combineHash("" + row.salt, password);
				if (!(hashedPass == row.password)) {
					return false;
				} else{
					return true;
				}
			}
		}
	});
	return true;
}

// Delete a specific user's account
app.delete('/api/registeredUsers/:user', function(req, res) {
	// sqlite3 requires setting "PRAGMA foreign_keys = ON; in order to uphold foreign key constraints,
	// so manually delete from hiscores too.
	let sql = "DELETE FROM hiscores WHERE username=?;"

	var username = "" + req.body.username;
	var password = "" + req.body.password;

	db.run(sql, [username], (err) => {
		valid = validateCreds(username, password);
		if (!valid) {
			result["error"] = "User is not authorized to delete this account";
			res.status(401);
		} else {
			if (err) {
				result["error"] = "Could not delete user account";
				console.log(err.message);
				// Username exists since this method is called from a user's own profile page,
				// and user is authorized, since validateLogin() worked, so must be server error
				res.status(500);
			} else {	
				db.run("DELETE FROM appuser WHERE username=?;", [username], (err) => {
					if (err) {
						result["error"] = "Could not delete user account";
						res.status(500);
					} else {
						res.status(200);
					}
				});
			}
		}
		res.json(result);
	});
});


// Get a user's avatar ID
app.get('/api/registeredUsers/:username/avatar/', function(req, res){
	let sql = "SELECT avatarID FROM appuser WHERE username=?;";

	var username = "" + req.params.username;

	db.get(sql, [username], (err, row) => {
		result = {};
		if (err){
			console.log(err)
			res.status(500);
		} else {
			if (!row) {
				result["error"] = "No such username exists";
				res.status(401);
			} else {
				var avID = row.avatarID;
				result["avatarID"] = avID;
				res.status(200);
			}
		}
		res.json(result);
	});
});

// Updating a user's highscores
app.post('/api/highScoresUpdate/:username/', (req,res)=>{
	var username = "" + req.params.username;
	let sql = 'UPDATE hiscores SET score = ? WHERE username=?;'
	var scores = "" + req.body.scores;

	console.log([scores,username]);
	result={}
	db.get("SELECT score FROM hiscores WHERE username=?", [username], (err,row)=>{
		if (!row){
			if (scores > row.score){
				db.run(sql, [scores, username], (err) => {
					result = {}
					if (err) {
						result["error"] = "failed to update";
						res.status(401);
					} else {
						res.status(200);
					}
					res.json(result);
				});
			}
			else{
				res.status(200);
			}
		}
		else{
			result["error"] = "failed to update";
			res.status(401);
		}
		
	});
});

module.exports = app;