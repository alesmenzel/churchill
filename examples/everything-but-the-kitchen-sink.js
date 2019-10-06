// You would normally set this in your environemnt variables (e.g. in .env)
process.env.CHURCHILL_DEBUG = "worker:a*"; // Log only namespaces matching worker:a:*
process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

const fs = require("fs");
const churchill = require("../src/churchill");

const { Console, File, HTTP, Stream } = churchill.transports;

// Setup the logger - returns a createLogger function
const createNamespace = churchill({
  transports: [
    Console.create({ maxLevel: "verbose" }),
    File.create({ filename: "temp/error.log", maxLevel: "error" }),
    File.create({ filename: "temp/combined.log", maxLevel: "info" }),
    HTTP.create({
      method: "POST",
      url: "http://localhost:5000/log",
      format: info => ({ ...info, logger: "churchill" })
    }),
    Stream.create({ stream: fs.createWriteStream("temp/stream.log") })
  ]
});

// Global logger without a namespace (always enabled)
const logger = createNamespace();
// @ts-ignore
logger.info("Global log message", { metadata: "no namespace" });
// @ts-ignore
logger.warn("Global warning log message");

// File worker-a.js
const loggerWorkerA = createNamespace("worker:a"); // namespace "worker:a"
// @ts-ignore
loggerWorkerA.info("Log from A", { name: "Worker A", data: "Data for A" });

// File worker-b.js
const loggerWorkerB = createNamespace("worker:b"); // namespace "worker:b"
const metadata = { from: "Worker B", time: Date.now() };
// @ts-ignore
loggerWorkerB.info(metadata);
// @ts-ignore
loggerWorkerB.verbose("This will not be logged because the max log level is info");

// File worker-c.js
const loggerWorkerC = createNamespace("worker:c"); // namespace "worker:c"
// @ts-ignore
loggerWorkerC.error("Worker C encountered an error", new Error("ERR!"));

process.on("uncaughtException", err => {
  // @ts-ignore
  logger.error(err);
});

throw new Error("ERR!");
