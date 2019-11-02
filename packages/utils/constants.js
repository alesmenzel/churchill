const E_BACKPRESSURE =
  "Backpressure: your logging destination buffer is full and messages will be lost, this usually means that your logging destination cannot keep up or is too slow";
const E_NOT_IMPLEMENTED =
  "Method 'log(info, output, logger)' must be implemented by the child class";

const ERROR = "error";
const WARN = "warn";
const INFO = "info";
const VERBOSE = "verbose";
const DEBUG = "debug";
const SILLY = "silly";

// Default log levels
const LEVELS = {
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

module.exports = {
  E_BACKPRESSURE,
  E_NOT_IMPLEMENTED,
  LEVELS,
  COLORS,
  ERROR,
  WARN,
  INFO,
  VERBOSE,
  DEBUG,
  SILLY
};
