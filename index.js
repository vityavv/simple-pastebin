let http = require("http");
let fs = require("fs");
let sqlite = require("sqlite3");
let shortid = require("shortid");
let hljs = require("highlight.js");

let db = new sqlite.Database("./database.db");
db.run("CREATE TABLE IF NOT EXISTS pastes (id TEXT UNIQUE PRIMARY KEY, data TEXT, created INTEGER)");
http.createServer(serverFunc).listen(8080);
setInterval(checkIfExpired, 3600000);

function serverFunc(req, res) {
	if (req.method === "GET") {
		if (req.url === "/") {
			fs.readFile("./index.html", (err, index) => {
				if (err) throw err;
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(index);
			});
		} else {
			db.get("SELECT data FROM pastes WHERE id = $id LIMIT 1", {$id: req.url.substring(1).split(".")[0]}, (err, paste) => {
				if (err) throw err;
				if (paste) {
					fs.readFile("./paste.html", "utf8", (err, file) => {
						if (err) throw err;
						res.writeHead(200, {"Content-Type": "text/html"});
						let highlighted = hljs.highlightAuto(paste.data);
						try {highlighted = hljs.highlight(req.url.split(".")[1], paste.data);} catch(e) {}//this means no language/undefined language was specified
						res.end(file.replace("{{PASTE}}", highlighted.value));
					})
				} else {
					res.writeHead(404, "404 Not Found");
					res.end("404 Not Found");
				}
			});
		}
	} else if (req.method === "POST") {
		if (req.url === "/") {
			let body = "";
			req.on("data", data => {
				body += data;
				if (body.length > 1e7) {
					res.writeHead(413, "Request Entity Too Large");
					res.write("Request Entity Too Large");
				}
			});
			req.on("end", () => {
				let id = shortid.generate();
				db.run("INSERT INTO pastes (id, data, created) VALUES ($id, $data, $created)", {$id: id, $data: body, $created: Math.floor(Date.now() / 3600000)}, err => {
					if (err) throw err;
					res.end(`http://localhost:8080/${id}`);
				});
			});
		}
	}
}

function checkIfExpired() {
	db.run("DELETE FROM pastes WHERE $now - created > 720", {$now: Math.floor(Date.now() / 3600000)}, err => {
		if (err) throw err;
	});
}
