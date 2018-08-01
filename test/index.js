const chalk = require("chalk");
const util = require("util");
const crypto = require("crypto");

// process.env.CHURCHILL_DEBUG = "worker:a:*"; // Log only namespaces matching worker:a:*
// process.env.CHURCHILL_DEBUG_LEVEL = "debug"; // Log only verbose and above

const churchill = require("../src/churchill");

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  verbose: "cyan",
  debug: "green",
  silly: "gray"
};

// Colorize the log level
const colorizeByLevel = level => chalk[colors[level.toLowerCase()]](level);

const md5 = str =>
  crypto
    .createHash("md5")
    .update(str)
    .digest("hex");

const colorizeByNamespace = namespace => {
  const hex = md5(md5(namespace)).slice(0, 6);

  return chalk.hex(`#${hex}`);
};

// Setup the logger - returns a createLogger function
const createLogger = churchill({
  transports: [new churchill.Console({ level: "verbose" })], // Transports - must have a log() function
  // Custom formatter function
  format: info => {
    const { namespace, level, timestamp, ms, args } = info;

    const namespaceColor = colorizeByNamespace(namespace);

    const time = chalk.gray(`[${timestamp.toISOString()}]`);
    const nmsp = namespaceColor(namespace);
    const lvl = colorizeByLevel(level.toUpperCase());
    const msg = chalk.gray(util.format(...args));
    const elapsed = namespaceColor(`+${ms}ms`);

    return `${time} ${nmsp} ${lvl} ${msg} ${elapsed}\n`;
  }
});

const loggerA = createLogger("worker:a"); // namespace
const loggerB = createLogger("worker:b"); // namespace
const loggerC = createLogger("worker:c"); // namespace

loggerA.info("test", { metadata: "some info" });
loggerB.info("test", { metadata: "some info" });
loggerC.info("test", { metadata: "some info" });
