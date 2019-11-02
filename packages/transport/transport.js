/* eslint-disable no-unused-vars */
const EventEmitter = require("events");
const { isset } = require("@churchill/utils");

const E_NOT_IMPLEMENTED = "log(info, output, logger) must be implemented by the child class";

/**
 * @typedef {import('@churchill/core')} Logger
 */

class Transport extends EventEmitter {
  /**
   * Create a Transport
   * @param {Object} [options] Options
   * @param {Function} [options.format] Formatting function
   * @param {String} [options.maxLevel] Max logging level
   */
  constructor(options = {}) {
    super();
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
   * @param {Logger} logger Logger
   */
  format(info, output, logger) {
    const { format } = this.options;
    return isset(format) ? format(info, output, logger) : output;
  }

  /**
   * Log a message
   * @param {Object} info Info
   * @param {*} [output] Formatted info by global formatter
   * @param {Logger} logger Logger
   */
  log(info, output, logger) {
    this.emit("error", new Error(E_NOT_IMPLEMENTED));
  }
}

module.exports = Transport;
