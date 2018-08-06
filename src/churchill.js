const transports = require("./transports");
const format = require("./format");

const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_LEVEL } = process.env;

const DEBUG = CHURCHILL_DEBUG;
const DEBUG_LEVEL = CHURCHILL_DEBUG_LEVEL;

// Default log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

// Create a list of RegExp matches to test against for namespaces
let namespaces;
if (DEBUG) {
  namespaces = DEBUG.split(/[\s,]+/).reduce((acc, namespace) => {
    if (!namespace) {
      return acc;
    }

    const regex = new RegExp(`^${namespace.replace(/\*/g, ".*?")}$`);
    acc.push(regex);
    return acc;
  }, []);
}

/**
 * Namespace matcher
 *
 * @param {String} input Namespace
 */
function matchNamespace(input) {
  if (!DEBUG) {
    return true;
  }

  return namespaces.some(namespace => input.match(namespace));
}

/**
 * Sets up the churchill logger
 *
 * @param {Object} options Options
 */
function setupLogger(options) {
  const { format, transports, level: globalLevel } = options;
  let lastLog;

  function createLogger(namespace = "") {
    const enabled = namespace ? matchNamespace(namespace) : true;

    /**
     * The main log function
     *
     * @param {String} level Level
     * @param {Array<*>} args Array of logged variables
     */
    function logger(level, ...args) {
      // Check if namespace is enabled
      if (!enabled) {
        return;
      }

      const priority = levels[level];

      // Check for global level option
      if (priority > globalLevel) {
        return;
      }

      // Check for global env. variable level option
      if (DEBUG_LEVEL && priority > levels[DEBUG_LEVEL]) {
        return;
      }

      const ms = lastLog ? Date.now() - lastLog : 0;
      const timestamp = new Date();

      const data = { level, priority, ms, timestamp, namespace, args };

      // Format the Message if global format function is defined
      const output = format ? format(data) : undefined;

      // Send the Message and formated message to all connected transports
      transports.forEach(transport => {
        // Check if the transport supports the level
        if (priority > levels[transport.opts.level]) {
          return;
        }

        transport.log(data, output);
      });
      lastLog = Date.now();
    }

    /**
     * Shorthand for logging with `logger.info(...)`, etc.
     */
    Object.keys(levels).forEach(level => {
      logger[level] = (...args) => logger(level, ...args);
    });

    return logger;
  }

  return createLogger;
}

setupLogger.transports = transports;
setupLogger.format = format;

module.exports = setupLogger;
