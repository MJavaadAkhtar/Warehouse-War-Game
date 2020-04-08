--- load with 
--- sqlite3 database.db < schema.sql
DROP TABLE IF EXISTS hiscores;
DROP TABLE IF EXISTS appuser;
DROP TABLE IF EXISTS worlds;

CREATE TABLE appuser (
	id INTEGER PRIMARY KEY,
	username VARCHAR(20) UNIQUE,
	password VARCHAR(20),
	salt VARCHAR(16),
	name VARCHAR(20),
	private INTEGER DEFAULT 0,
	avatarID VARCHAR DEFAULT "coolImg"
);

CREATE TABLE hiscores (
	id INTEGER PRIMARY KEY,
	score INT DEFAULT 0,
	username VARCHAR(20),
	name VARCHAR(20),
	private INTEGER DEFAULT 0,
	
	UNIQUE(username),
	FOREIGN KEY (username) REFERENCES appuser(username) ON DELETE CASCADE
);

CREATE TABLE worlds (
	id INTEGER PRIMARY KEY,
	numPlayers INTEGER,
	name VARCHAR(20),
	playerCap INTEGER,

	CHECK(numPlayers <= playerCap)
);