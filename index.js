//Native modules (mostly for server)
let http = require("http");
let https = require("https");
let fs = require("fs");
//Not native modules (db, id creater, syntax highlighting)
let sqlite = require("sqlite3");
let shortid = require("shortid");
let hljs = require("highlight.js");
//Create connection with and set up DB and HTTP server. Start interval that checks for expired pastes
let db = new sqlite.Database("./database.db");
db.run("CREATE TABLE IF NOT EXISTS pastes (id TEXT UNIQUE PRIMARY KEY, data TEXT, created INTEGER)");
https.createServer(serverFunc).listen(8081);
http.createServer(serverFunc).listen(8080);
setInterval(checkIfExpired, 3600000);

function serverFunc(req, res) {
	if (req.method === "GET") {
		if (req.url === "/") {
			//serve main page
			fs.readFile("./index.html", (err, index) => {
				if (err) throw err;
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(index);
			});
		} else {
			//get paste
			db.get("SELECT data FROM pastes WHERE id = $id LIMIT 1", {$id: req.url.substring(1).split(".")[0]}, (err, paste) => {
				if (err) throw err;
				//only serve if it exists. Otherwise, 404
				if (paste) {
					if (req.url.split(".")[1] === "plain") {
						//serve plain text
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(paste.data);
					} else {
						fs.readFile("./paste.html", "utf8", (err, file) => {
							if (err) throw err;
							res.writeHead(200, {"Content-Type": "text/html"});
							//default - automatic highlgiht
							let highlighted = hljs.highlightAuto(paste.data);
							//hljs errors if language is not recognized. We can use this to try and highlight with specified lang
							try {highlighted = hljs.highlight(req.url.split(".")[1], paste.data);} catch(e) {}
							res.end(file.replace("{{PASTE}}", highlighted.value));
						});
					}
				} else {
					res.writeHead(404, "404 Not Found");
					res.end("404 Not Found");
				}
			});
		}
	} else if (req.method === "POST") {
		if (req.url === "/") {
			//read post request
			let body = "";
			let stop = false;//to stop if req is too large
			req.on("data", data => {
				body += data;
				if (body.length > 500000) {//500k char max
					res.writeHead(413, "Request Entity Too Large");
					res.end("Request Entity Too Large");
					stop = true;
				}
			});
			req.on("end", () => {
				if (stop) return;
				//generate a new ID
				let id = shortid.generate();
				//Math.floor(Date.now() / 3600000) is number of hours from epoch. Used to calculate expiration
				db.run("INSERT INTO pastes (id, data, created) VALUES ($id, $data, $created)", {$id: id, $data: body, $created: Math.floor(Date.now() / 3600000)}, err => {
					if (err) throw err;
					res.end(`/${id}`);//return new URL
				});
			});
		}
	}
}
//runs every hour. Checks if pastes are expired.
function checkIfExpired() {
	db.run("DELETE FROM pastes WHERE $now - created > 720", {$now: Math.floor(Date.now() / 3600000)}, err => {
		if (err) throw err;
	});
}
