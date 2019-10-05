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

module.exports = {
  LEVELS,
  DEBUG,
  DEBUG_LEVEL,
  DEBUG_SEPARATOR,
  DEBUG_NAMESPACES
};
