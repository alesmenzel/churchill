const Transport = require("../transport");
const defaultFormat = require("../format");
const { LogError } = require("../errors");
const { E_BACKPRESSURE } = require("../config");

/**
 * @typedef {import("stream").Writable} Writable
 * @typedef {import("../logger")} Logger
 */

class Stream extends Transport {
  /**
   * Synchronous logging to a stream
   * @param {Object} opts Options
   * @param {Function} [opts.format] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   * @param {Writable} opts.stream Stream
   */
  constructor(opts) {
    super({ ...opts, format: opts.format || defaultFormat.toText });
    const { stream } = opts;
    if (!stream) {
      throw new Error("You must provide a stream, did you forget to pass options.stream?");
    }
    this.writable = true;
    this.stream = stream;
    this.stream.on("error", err => {
      this.emit("error", err);
    });
    this.stream.on("drain", () => {
      this.writable = true;
    });
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} output (Optional) Output of the global formatting function
   * @param {Logger} logger Logger
   */
  log(info, output, logger) {
    const out = this.format(info, output, logger);
    if (!this.writable) {
      this.emit("error", new LogError(E_BACKPRESSURE, { info, out }));
      return;
    }
    const canWrite = this.stream.write(out);
    if (!canWrite) {
      this.writable = false;
    }
  }
}

/**
 * Create a stream transport
 * @param {Object} opts Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max logging level
 * @param {Writable} opts.stream Stream
 */
Stream.create = opts => {
  return new Stream(opts);
};

module.exports = Stream;
