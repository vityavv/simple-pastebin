let http = require("http");
let fs = require("fs");
let sqlite = require("sqlite3");

let db = new sqlite.Database("./database.db");

http.createServer(serverFunc).listen(8080);
function serverFunc(req, res) {
	if (req.method === "GET") {
		if (req.url === "/") {
			fs.readFile("./index.html", (err, index) => {
				if (err) throw err;
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(index);
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
				console.log(body);
				res.end();
			});
		}
	}
}
