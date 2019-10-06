const { LEVELS, COLORS, DEBUG_LEVEL } = require("./config");
const { isset, isNamespaceEnabled } = require("./utils");

/**
 * @typedef {import("./transport")} Transport
 */

// TODO: find a way to allow any property with JSDoc because they are added dynamicly and TS complains
class Logger {
  /**
   * Create a Logger
   * @param {Object} [options] Options
   * @param {Object<String,Number>} [options.levels=LEVELS] Log levels hashtable
   * @param {Object<String,String>} [options.colors=COLORS] Log level colors hashtable
   * @param {String} [options.namespace] Namespace id
   * @param {Number} [options.maxLevel] Max log level
   * @param {Array<Transport>} [options.transports=[]] Transports to send the logs
   * @param {Function} [options.format] Log formatter function
   */
  constructor(options = {}) {
    const {
      levels = LEVELS,
      colors = COLORS,
      namespace,
      maxLevel,
      transports = [],
      format
    } = options;
    this.enabled = isset(namespace) ? isNamespaceEnabled(namespace) : true;
    this.levels = levels;
    this.colors = colors;
    this.maxLevel = maxLevel;
    this.namespace = namespace;
    this.transports = transports;
    this.format = format;

    // TODO: Move to instance properties
    this.lastLogTimestamp = null;

    // Define log levels
    Object.keys(levels).forEach(level => {
      Object.defineProperty(this, level, {
        get() {
          return this.log.bind(this, level);
        }
      });
    });
  }

  /**
   * The main log function
   * @param {String} level Level
   * @param {Array<*>} [args] Array of logged variables
   */
  log(level, ...args) {
    const { enabled, levels, namespace, maxLevel, transports, format } = this;
    // Check if namespace is enabled
    if (!enabled) return;
    const priority = levels[level];
    // Check for max log level option
    if (priority > maxLevel) return;
    // Check for max global env. variable level option
    const globalMaxLevel = levels[DEBUG_LEVEL];
    if (isset(DEBUG_LEVEL) && isset(globalMaxLevel) && priority > globalMaxLevel) return;

    const timestamp = Date.now();
    const ms = this.lastLogTimestamp ? timestamp - this.lastLogTimestamp : 0;
    const data = { level, priority, ms, timestamp, namespace, args };

    // Format the message if global format function is defined
    const output = isset(format) && format(data);

    // Send the Message and formated message to all connected transports
    transports.forEach(transport => {
      // TODO: possible move this logic to transport itself (?)
      const maxLevel = transport.getMaxLevel();
      const maxPriority = levels[maxLevel];
      if (isset(maxLevel) && isset(maxPriority) && priority > maxPriority) return;
      transport.log(data, output, this);
    });
    this.lastLogTimestamp = Date.now();
  }

  /**
   * Enable the logger
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable the logger
   */
  disable() {
    this.enabled = false;
  }
}

/**
 * Create a Logger
 * @param {Object} [options] Options
 * @param {Object<String,Number>} [options.levels] Log levels hashtable
 * @param {Object<String,String>} [options.colors] Log level colors hashtable
 * @param {String} [options.namespace] Namespace id
 * @param {Number} [options.maxLevel] Max log level
 * @param {Array<Transport>} [options.transports] Transports to send the logs
 * @param {Function} [options.format] Log formatter function
 */
Logger.createLogger = options => {
  return new Logger(options);
};

module.exports = Logger;
