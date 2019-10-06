/* eslint-disable no-console */
const http = require("http");

const PORT = 5000;

http
  .createServer((req, res) => {
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
  .listen(PORT, () => {
    console.log("HTTP: Listening on port %s", PORT);
  });
