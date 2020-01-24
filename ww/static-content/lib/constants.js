global.wwPort = 10820; // CHANGE ME
global.wwWsPort = global.wwPort+1; // for websockets DON'T CHANGE
// global.wwHostname = "cslinux.utm.utoronto.ca"; DON'T CHANGE
global.wwHostname = "localhost"; // CHANGE ME
global.wwWsURL = "ws://"+global.wwHostname+":"+global.wwWsPort; // DON'T CHANGE

global.dbURL = "mongodb://qureshid:09014@mcsdb.utm.utoronto.ca:27017/qureshid_309";
global.dbName = "qureshid_309";