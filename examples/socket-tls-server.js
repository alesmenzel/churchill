/* eslint-disable no-console */
const path = require("path");
const tls = require("tls");
const fs = require("fs");

const options = {
  key: fs.readFileSync(path.join(__dirname, "keys/server-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "keys/server-crt.pem")),
  ca: fs.readFileSync(path.join(__dirname, "keys/ca-crt.pem")),
  requestCert: true,
  rejectUnauthorized: true
};

const server = tls.createServer(options, socket => {
  console.log("server connected", socket.authorized ? "authorized" : "unauthorized");

  socket.on("error", error => {
    console.log(error);
  });

  socket.write("welcome!\n");
  socket.setEncoding("utf8");
  socket.pipe(process.stdout);
  socket.pipe(socket);
});

server.listen(8000, () => {
  console.log("server bound");
});

// Connect from CLI
// openssl s_client -brief -connect localhost:8000 -cert client1-crt.pem -key client1-key.pem
