// namespaces
// colors
// levels
// MS between logs
// enable certain namespaces
// enable certain log level

const Console = require("./transports/console");
const File = require("./transports/file");

const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_LEVEL } = process.env;

const DEBUG = CHURCHILL_DEBUG;
const DEBUG_LEVEL = CHURCHILL_DEBUG_LEVEL;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

let lastLog = Date.now();

// Create a list of RegExp matches to test against
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

function matchNamespace(input) {
  if (!DEBUG) {
    return true;
  }

  return namespaces.some(namespace => input.match(namespace));
}

function setupLogger(options) {
  const { format, transports } = options;

  function createLogger(namespace) {
    const enabled = matchNamespace(namespace);

    function logger(level, ...args) {
      if (!enabled) {
        return;
      }

      const priority = levels[level];

      if (DEBUG_LEVEL && priority > levels[DEBUG_LEVEL]) {
        return;
      }

      const ms = Date.now() - lastLog;
      const timestamp = new Date();

      const data = {
        level,
        priority,
        ms,
        timestamp,
        namespace,
        args
      };

      const output = format(data);
      transports.forEach(transport => {
        if (priority > levels[transport.opts.level]) {
          return;
        }

        transport.log(output, data);
      });
      lastLog = Date.now();
    }

    Object.keys(levels).forEach(level => {
      logger[level] = (...args) => logger(level, ...args);
    });

    return logger;
  }

  return createLogger;
}

setupLogger.Console = Console;
setupLogger.File = File;

module.exports = setupLogger;
