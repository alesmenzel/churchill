/* eslint-disable no-console */
const net = require("net");

const server = net.createServer(socket => {
  socket.on("data", data => {
    console.log(data.toString("utf8").slice(0, -1));
    socket.write(data);
  });

  socket.on("error", err => {
    console.error("socket:", err);
  });
});

server.listen(1337, "127.0.0.1");

server.on("error", err => {
  console.error("server:", err);
});

// Connect from CLI
// nc localhost 1337
