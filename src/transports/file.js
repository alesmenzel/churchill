const fs = require("fs");

const Transport = require("../transport");
const defaultFormat = require("../format");
const { LogError } = require("../errors");
const { E_BACKPRESSURE } = require("../config");

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

    this.writable = true;
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
   * @param {*} [output] Output of the global formatting function
   */
  log(info, output) {
    const out = this.format(info, output);
    // stream buffer is full
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
