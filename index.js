let http = require("http");
let sqlite = require("sqlite3");

let db = new sqlite3.Database("./database.db");

http.createServer(serverFunc).listen(8080);
function serverFunc(req, res) {

}
