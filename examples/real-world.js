const churchill = require("../src/churchill");

const { Console, File } = churchill.transports;

const isProduction = process.env.NODE_ENV === "production";

const transports = [
  File.create({ filename: "temp/error.log", maxLevel: "error" }),
  File.create({ filename: "temp/combined.log", maxLevel: "info" })
];

if (!isProduction) {
  // @ts-ignore
  transports.push(Console.create({ maxLevel: "info" }));
}

// Setup the logger - returns a createLogger function
const createNamespace = churchill({ transports });

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
