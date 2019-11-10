// You would normally set this in your environemnt variables (e.g. in .env)
process.env.CHURCHILL_DEBUG = "worker:a*"; // Log only namespaces matching worker:a:*
process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

const fs = require("fs");
const util = require("util");
const churchill = require("@churchill/core");
const Console = require("@churchill/console");
const File = require("@churchill/file");
const HTTP = require("@churchill/http");
const Stream = require("@churchill/stream");
const Elastic = require("@churchill/elastic");
const Transport = require("@churchill/transport");

/**
 * README:
 * In order to run this example, you will need to run the destinations
 * (e.g. http server, elasticsearch instance, etc.). You can find dummy server
 * samples in the root of the project in the folder servers/
 *
 * Use Node ^12.12.0
 *
 * Example:
 * `node servers/http-server`
 * `node packages/examples/kitchen-sink.js`
 */

const customFormat = info => {
  const { namespace, level, ms, args } = info;
  return `${namespace} ${level} ${util.format(...args)} +${ms}ms\n`;
};

class CustomTransport extends Transport {
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    process.stdout.write(`CUSTOM: ${out}`);
  }

  static create(opts) {
    return new CustomTransport(opts);
  }
}

function handleError(err) {
  // you should always handle errors from logging, those can be for example:
  // 1) slow destination stream (backpreassure)
  // 2) unavailable destination (e.g. for http)

  // eslint-disable-next-line no-console
  console.error(err);
}

// Setup the logger - returns a createLogger function
const createNamespace = churchill({
  transports: [
    Console.create({ maxLevel: "verbose" }).on("error", handleError),
    File.create({ filename: "temp/error.log", maxLevel: "error" }).on("error", handleError),
    File.create({ filename: "temp/combined.log", maxLevel: "info" }).on("error", handleError),
    HTTP.create({
      method: "POST",
      url: "http://localhost:5000/log",
      format: info => ({ ...info, logger: "churchill" })
    }).on("error", handleError),
    Stream.create({ stream: fs.createWriteStream("temp/stream.log") }).on("error", handleError),
    CustomTransport.create({ format: customFormat }).on("error", handleError),
    Elastic.create({ node: "http://localhost:9200", index: "churchill-logs" }).on(
      "error",
      handleError
    )
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
