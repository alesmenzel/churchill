/* eslint-disable no-console */
const path = require("path");
const tls = require("tls");
const fs = require("fs");

/**
 * Note:
 * You can connect to the tls socket through CLI:
 * ```bash
 * $ openssl s_client -connect localhost:5000 -cert ./examples/servers/keys/client1-crt.pem -key ./examples/servers/keys/client1-key.pem
 * ```
 */

const options = {
  key: fs.readFileSync(path.join(__dirname, "keys/server-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "keys/server-crt.pem")),
  ca: fs.readFileSync(path.join(__dirname, "keys/ca-crt.pem")),
  requestCert: true,
  rejectUnauthorized: true
};

function createServer(port) {
  return tls
    .createServer(options, socket => {
      console.log("New socket connection");

      socket.on("data", data => {
        console.log("Incomming data: %s", data.toString("utf8"));
        socket.write("Success!\n");
      });

      socket.on("error", error => {
        console.error("Socket error", error);
      });

      socket.setEncoding("utf8");
      socket.write("Welcome!\n");
    })
    .on("error", err => {
      console.error("Server error:", err);
    })
    .listen(port, () => {
      console.log("TLS Socket: Listening on port %s", port);
    });
}

module.exports = createServer;
