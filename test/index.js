const chalk = require("chalk");
const util = require("util");

process.env.CHURCHILL_DEBUG = "*";
// process.env.CHURCHILL_DEBUG_LEVEL = "info";

const churchill = require("../src/churchill");

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  verbose: "cyan",
  debug: "green",
  silly: "gray"
};

const colorizeLevel = level => chalk[colors[level.toLowerCase()]](level);

const createLogger = churchill({
  transports: [new churchill.Console({ level: "verbose" })],
  format: info => {
    const { namespace, level, timestamp, ms, args } = info;

    // eslint-disable-next-line
    return `[${timestamp.toISOString()}] ${chalk.blue(namespace)} ${colorizeLevel(level.toUpperCase())} ${util.format(...args)} +${ms}ms\n`
  }
});

const logger = createLogger("namespace:test");

logger.silly("test", { a: 5 });
logger.debug("test", { a: 5 });
logger.verbose("test", { a: 5 });
logger.info("test", { a: 5 });
logger.warn("test", { a: 5 });
logger.error("test", { a: 5 }, new Error("Wtf!"));

logger("error", "test", { abc: 546 });
