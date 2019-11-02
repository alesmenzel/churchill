const path = require("path");
const fs = require("fs");
// eslint-disable-next-line import/no-extraneous-dependencies
const churchill = require("@churchill/core");

const HTTP = require("../http");

const certFile = path.resolve(__dirname, "servers/keys/client1-crt.pem");
const keyFile = path.resolve(__dirname, "servers/keys/client1-key.pem");
const caFile = path.resolve(__dirname, "servers/keys/ca-crt.pem");

// Setup the logger - returns a createLogger function
const createNamespace = churchill({
  transports: [
    HTTP.create({
      method: "POST",
      url: "https://localhost:5000/log",
      // @ts-ignore
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      ca: fs.readFileSync(caFile),
      format: info => ({ ...info, http: true })
    })
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
