// process.env.CHURCHILL_DEBUG = "worker:a:*"; // Log only namespaces matching worker:a:*
// process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

const fs = require("fs");
const churchill = require("../src/churchill");

const { Console, File, HTTP, Stream } = churchill.transports;

// Setup the logger - returns a createLogger function
const createNamespace = churchill({
  transports: [
    Console.create({ maxLevel: "verbose" }),
    File.create({ filename: "error.log", maxLevel: "error" }),
    File.create({ filename: "combined.log", maxLevel: "info" }),
    HTTP.create({
      method: "POST",
      url: "https://postman-echo.com/post",
      format: info => ({ ...info, http: true })
    }),
    Stream.create({ stream: fs.createWriteStream("stream.log") })
  ]
});

const logger = createNamespace(); // Global logger - always enabled

const loggerA = createNamespace("worker:a"); // namespace "worker:a"
const loggerB = createNamespace("worker:b"); // namespace "worker:b"
const loggerC = createNamespace("worker:c"); // namespace "worker:c"

loggerA.info("test", { metadata: "some info" });
loggerB.info("test", { metadata: "some info" });
loggerC.error("test", { metadata: "some info" }, new Error("ERR!"));

// process.on("uncaughtException", err => {
//   logger.error(err);
// });

// throw new Error("ERR!");
