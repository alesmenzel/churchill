/* eslint-disable class-methods-use-this, no-unused-vars */
const { isset } = require("./utils");

/**
 * @typedef {import("./logger")} Logger
 */

class Transport {
  /**
   * Create a Transport
   * @param {Object} [options] Options
   * @param {Function} [options.format] Formatting function
   * @param {String} [options.maxLevel] Max logging level
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Return the max log level
   */
  getMaxLevel() {
    return this.options.maxLevel;
  }

  /**
   * Format the log message
   * @param {Object} info Info
   * @param {*} [output] Formatted info by global formatter
   */
  format(info, output) {
    const { format } = this.options;
    return isset(format) ? format(info, output) : output;
  }

  /**
   * Log a message
   * @param {Object} info Info
   * @param {*} [output] Formatted info by global formatter
   * @param {Logger} logger Logger
   */
  log(info, output, logger) {
    throw new Error("log(info, output) must be implemented by the child class");
  }
}

module.exports = Transport;
