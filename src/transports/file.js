const fs = require("fs");

const Transport = require("../transport");
const defaultFormat = require("../format");

class File extends Transport {
  /**
   * Synchronous logging to a file
   * @param {Object} opts Options
   * @param {Function} [opts.format] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   * @param {String} opts.filename Filename
   */
  constructor(opts) {
    super({ ...opts, format: opts.format || defaultFormat.toText });
    const { filename } = opts;
    this.filename = filename;
    this.stream = fs.createWriteStream(filename, { flags: "a" });
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   */
  log(info, output) {
    output = this.format(info, output);
    // TODO: handle backpressure
    return this.stream.write(output);
  }
}

/**
 * Synchronous logging to a file
 * @param {Object} opts Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max logging level
 * @param {String} opts.filename Filename
 */
File.create = opts => {
  return new File(opts);
};

module.exports = File;
