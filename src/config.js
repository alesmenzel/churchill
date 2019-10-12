const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_LEVEL } = process.env;

const ERROR = "error";
const WARN = "warn";
const INFO = "info";
const VERBOSE = "verbose";
const DEBUG = "debug";
const SILLY = "silly";

// Default log levels
const PRIORITY = {
  [ERROR]: 0,
  [WARN]: 1,
  [INFO]: 2,
  [VERBOSE]: 3,
  [DEBUG]: 4,
  [SILLY]: 5
};

// Default color scheme
const COLORS = {
  [ERROR]: "red",
  [WARN]: "yellow",
  [INFO]: "blue",
  [VERBOSE]: "cyan",
  [DEBUG]: "green",
  [SILLY]: "white"
};

const DEBUG_SEPARATOR = /[\s,]+/;

// Create a list of RegExp matches to test against for namespaces
let DEBUG_NAMESPACES;
if (CHURCHILL_DEBUG !== undefined) {
  DEBUG_NAMESPACES = CHURCHILL_DEBUG.split(DEBUG_SEPARATOR).reduce((acc, namespace) => {
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
  LEVELS: PRIORITY,
  COLORS,
  CHURCHILL_DEBUG,
  CHURCHILL_DEBUG_LEVEL,
  DEBUG_SEPARATOR,
  DEBUG_NAMESPACES,
  E_BACKPRESSURE,
  E_NOT_IMPLEMENTED,
  ERROR,
  WARN,
  INFO,
  VERBOSE,
  DEBUG,
  SILLY
};
