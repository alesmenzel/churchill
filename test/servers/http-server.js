/* eslint-disable no-console */
const http = require("http");

function createServer(port, next) {
  return http
    .createServer()
    .on("error", err => {
      console.error("Server error:", err);
    })
    .listen(port, next);
}

module.exports = createServer;
