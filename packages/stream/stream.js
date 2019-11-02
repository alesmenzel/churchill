const Transport = require("@churchill/transport");
const { ChurchillError } = require("@churchill/utils");

const toText = require("./format");

const E_BACKPRESSURE =
  "Backpressure: your logging destination buffer is full and messages will be lost, this usually means that your logging destination cannot keep up or is too slow";

/**
 * @typedef {import("stream").Writable} Writable
 * @typedef {import("@churchill/core")} Logger
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
    super({ ...opts, format: opts.format || toText });
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
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    if (!this.writable) {
      this.emit("error", new ChurchillError(E_BACKPRESSURE, { info, out }));
      return null;
    }
    const canWrite = this.stream.write(out);
    if (!canWrite) {
      this.writable = false;
    }
    return null;
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
