const util = require("util");

const churchill = require("../src/churchill");

const customFormat = info => {
  const { namespace, level, ms, args } = info;

  return `${namespace} ${level} ${util.format(...args)} +${ms}ms\n`;
};

// Setup the logger - returns a createLogger function
const createLogger = churchill({
  transports: [new churchill.Console({ format: customFormat })]
});

const loggerA = createLogger("worker:a"); // namespace "worker:a"
const loggerB = createLogger("worker:b"); // namespace "worker:b"
const loggerC = createLogger("worker:c"); // namespace "worker:c"

loggerA.info("test", { metadata: "some info" });
loggerB.info("test", { metadata: "some info" });
loggerC.error("test", { metadata: "some info" });
