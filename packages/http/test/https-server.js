/* eslint-disable no-console */
const https = require("https");
const fs = require("fs");
const path = require("path");

const options = {
  key: fs.readFileSync(path.join(__dirname, "../../../keys/server-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../../../keys/server-crt.pem"))
};

function createServer(port) {
  return https
    .createServer(options, (req, res) => {
      const body = [];
      req.on("data", chunk => {
        body.push(chunk);
      });
      req.on("end", () => {
        const data = Buffer.concat(body).toString();
        console.log(req.method, req.url, data);
        res.writeHead(200);
        res.end("Success!\n");
      });
    })
    .on("error", err => {
      console.error("Server error:", err);
    })
    .listen(port, () => {
      console.log("HTTPS: Listening on port %s", port);
    });
}

module.exports = createServer;
