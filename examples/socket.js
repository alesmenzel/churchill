// // process.env.CHURCHILL_DEBUG = "worker:a:*"; // Log only namespaces matching worker:a:*
// // process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

// const churchill = require("../src/churchill");

// const socket = new churchill.transports.Socket({ host: "127.0.0.1", port: 1337, queueLimit: 10 });

// socket.on("error", err => {
//   // eslint-disable-next-line
//   console.log("ERR!", err);
// });

// // Setup the logger - returns a createLogger function
// const createLogger = churchill({
//   transports: [socket]
// });

// const loggerA = createLogger("worker:a"); // namespace "worker:a"
// const loggerB = createLogger("worker:b"); // namespace "worker:b"
// const loggerC = createLogger("worker:c"); // namespace "worker:c"

// loggerA.info("test", { metadata: "some info" });
// loggerB.info("test", { metadata: "some info" });
// loggerC.error("test", { metadata: "some info" }, new Error("ERR!"));

// let i = 0;
// setInterval(() => {
//   loggerB.info("async", { metadata: i });
//   i += 1;
// }, 500);
