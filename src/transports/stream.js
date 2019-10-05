const Transport = require("../transport");
const defaultFormat = require("../format");

/**
 * @typedef {import("stream").Writable} Writable
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
    this.stream = stream;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} output (Optional) Output of the global formatting function
   */
  log(info, output) {
    output = this.format(info, output);
    // TODO: handle backpressure
    return this.stream.write(output);
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
