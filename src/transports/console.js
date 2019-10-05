const Transport = require("../transport");
const defaultFormat = require("../format");
const { isset } = require("../utils");

/**
 * @typedef {import("../logger")} Logger
 */

/**
 * Synchronous logging to console (stdout/stderr streams)
 * @param {Object} [opts] Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max log level
 * @param {String} [opts.errorLevel="error"] Max log level to stream to stderr
 */
class Console extends Transport {
  constructor(opts = {}) {
    super({ ...opts, format: opts.format || defaultFormat.toTerminal });
    const { errorLevel = "error" } = opts;
    this.errorLevel = errorLevel;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   * @param {Logger} logger Logger
   */
  log(info, output, logger) {
    const out = this.format(info, output);
    const { errorLevel: errorLevels } = this;

    const { priority } = info;
    const errorPriority = logger.levels[errorLevels];
    if (isset(this.errorLevel) && priority <= errorPriority) {
      // TODO: handle backpressure
      return process.stderr.write(out);
    }

    // TODO: handle backpressure
    return process.stdout.write(out);
  }
}

/**
 * Synchronous logging to console (stdout/stderr streams)
 * @param {Object} [opts] Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max log level
 * @param {String} [opts.errorLevels] Max log level to stream to stderr
 */
Console.create = opts => {
  return new Console(opts);
};

module.exports = Console;
