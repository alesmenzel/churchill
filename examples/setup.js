// process.env.CHURCHILL_DEBUG = "worker:a:*"; // Log only namespaces matching worker:a:*
// process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

const churchill = require("../src/churchill");

// Setup the logger - returns a createLogger function
const createLogger = churchill({
  transports: [
    new churchill.Console({ level: "verbose" }),
    new churchill.File({ filename: "error.log", level: "error" }),
    new churchill.File({ filename: "combined.log", level: "info" })
  ]
});

const logger = createLogger(); // Global logger - always enabled

const loggerA = createLogger("worker:a"); // namespace "worker:a"
const loggerB = createLogger("worker:b"); // namespace "worker:b"
const loggerC = createLogger("worker:c"); // namespace "worker:c"

loggerA.info("test", { metadata: "some info" });
loggerB.info("test", { metadata: "some info" });
loggerC.error("test", { metadata: "some info" }, new Error("ERR!"));

process.on("uncaughtException", err => {
  logger.error(err);
  process.exit(1);
});

throw new Error("ERR!");
