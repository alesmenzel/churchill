const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_LEVEL } = process.env;

// Default log levels
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const DEBUG = CHURCHILL_DEBUG;
const DEBUG_LEVEL = CHURCHILL_DEBUG_LEVEL;
const DEBUG_SEPARATOR = /[\s,]+/;

// Create a list of RegExp matches to test against for namespaces
let DEBUG_NAMESPACES;
if (CHURCHILL_DEBUG !== undefined) {
  DEBUG_NAMESPACES = DEBUG.split(DEBUG_SEPARATOR).reduce((acc, namespace) => {
    if (!namespace) return acc;
    const regex = new RegExp(`^${namespace.replace(/\*/g, ".*?")}$`);
    acc.push(regex);
    return acc;
  }, []);
}

const E_BACKPRESSURE =
  "WARNING: [Backpressure]: your logging destination buffer is full and messages will be lost, this usually means that your logging destination cannot keep up or is too slow";
const E_NOT_IMPLEMENTED = "log(info, output, logger) must be implemented by the child class";

module.exports = {
  LEVELS,
  DEBUG,
  DEBUG_LEVEL,
  DEBUG_SEPARATOR,
  DEBUG_NAMESPACES,
  E_BACKPRESSURE,
  E_NOT_IMPLEMENTED
};
