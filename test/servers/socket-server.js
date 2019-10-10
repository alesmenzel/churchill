/* eslint-disable no-console */
const net = require("net");

/**
 * Note:
 * You can connect to the socket through CLI:
 * ```bash
 * $ nc localhost 5000
 * ```
 */

function createServer(port) {
  return net
    .createServer(socket => {
      console.log("New socket connection");

      socket.on("data", data => {
        console.log("Incomming data: %s", data.toString("utf8"));
        socket.write("Success!\n");
      });

      socket.on("error", err => {
        console.error("Socket error:", err);
      });

      socket.setEncoding("utf8");
      socket.write("Welcome!\n");
    })
    .on("error", err => {
      console.error("Server error:", err);
    })
    .listen(port, () => {
      console.log("Socket: Listening on port %s", port);
    });
}

module.exports = createServer;
