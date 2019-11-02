const Transport = require("@churchill/transport");
const { isset, ChurchillError, E_BACKPRESSURE } = require("@churchill/utils");

const toTerminal = require("./format");

/**
 * @typedef {import("@churchill/core")} Logger
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
    super({ ...opts, format: opts.format || toTerminal });
    const { errorLevel = "error" } = opts;
    this.errorLevel = errorLevel;

    this.stderrWritable = true;
    this.stderr = process.stderr;
    this.stderr.on("error", err => {
      this.emit("error", err);
    });
    this.stderr.on("drain", () => {
      this.stderrWritable = true;
      this.emit("drain", "stderr");
    });

    this.stdoutWritable = true;
    this.stdout = process.stdout;
    this.stdout.on("error", err => {
      this.emit("error", err);
    });
    this.stdout.on("drain", () => {
      this.stdoutWritable = true;
      this.emit("drain", "stdout");
    });
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   * @param {Logger} logger Logger
   */
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    const { errorLevel: errorLevels } = this;

    const { priority } = info;
    const errorPriority = logger.levels[errorLevels];
    if (isset(this.errorLevel) && priority <= errorPriority) {
      // stream buffer is full
      if (!this.stderrWritable) {
        this.emit("error", new ChurchillError(E_BACKPRESSURE, { info, out }));
        return null;
      }
      const canWrite = this.stderr.write(out);
      if (!canWrite) {
        this.stderrWritable = false;
      }
      return null;
    }

    // stream buffer is full
    if (!this.stdoutWritable) {
      this.emit("error", new ChurchillError(E_BACKPRESSURE, { info, out }));
      return null;
    }
    const canWrite = this.stdout.write(out);
    if (!canWrite) {
      this.stdoutWritable = false;
    }
    return null;
  }
}

/**
 * Synchronous logging to console (stdout/stderr streams)
 * @param {Object} [opts] Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max log level
 * @param {String} [opts.errorLevel] Max log level to stream to stderr
 */
Console.create = opts => {
  return new Console(opts);
};

module.exports = Console;
