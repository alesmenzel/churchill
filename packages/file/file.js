const fs = require("fs");
const Transport = require("@churchill/transport");
const { ChurchillError, E_BACKPRESSURE } = require("@churchill/utils");

const toText = require("./format");

/**
 * @typedef {import("@churchill/core")} Logger
 */

class File extends Transport {
  /**
   * Synchronous logging to a file
   * @param {Object} opts Options
   * @param {Function} [opts.format] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   * @param {String} opts.filename Filename
   */
  constructor(opts) {
    super({ ...opts, format: opts.format || toText });
    const { filename } = opts;
    this.filename = filename;
    this.stream = fs.createWriteStream(filename, { flags: "a" });

    this.writable = true;
    this.stream.on("error", err => {
      this.emit("error", err);
    });
    this.stream.on("drain", () => {
      this.writable = true;
      this.emit("drain");
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
    // stream buffer is full
    if (!this.writable) {
      this.emit("error", new ChurchillError(E_BACKPRESSURE, { info, out }));
      return null;
    }
    return new Promise((resolve, reject) => {
      const canWrite = this.stream.write(out, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(null);
      });
      if (!canWrite) {
        this.writable = false;
      }
    });
  }

  /**
   * End the destination filestream
   */
  async end() {
    return new Promise((resolve, reject) => {
      this.stream.end(err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
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
