const transports = require("./transports");
const format = require("./format");
const Logger = require("./logger");
const Transport = require("./transport");
const { LEVELS, COLORS, ERROR, WARN, INFO, VERBOSE, DEBUG, SILLY } = require("./config");

/**
 * Sets up the churchill logger
 * @param {Object} [options] Options
 * @param {Object<String,Number>} [options.levels] Log levels hashtable
 * @param {Object<String,String>} [options.colors] Log level colors hashtable
 * @param {Function} [options.format] Formatting function
 * @param {Array<Object>} [options.transports] Transports
 * @param {String} [options.maxLevel] Max logged level
 */
function churchill(options) {
  /**
   * Create a namespace
   * @param {String} [namespace] Namespace
   */
  function createNamespace(namespace) {
    return Logger.createLogger({ ...options, namespace });
  }

  return createNamespace;
}

churchill.Logger = Logger;
churchill.createLogger = Logger.createLogger;
churchill.format = format;
churchill.transports = transports;
churchill.Transport = Transport;
churchill.LEVELS = LEVELS;
churchill.COLORS = COLORS;
churchill.ERROR = ERROR;
churchill.WARN = WARN;
churchill.INFO = INFO;
churchill.VERBOSE = VERBOSE;
churchill.DEBUG = DEBUG;
churchill.SILLY = SILLY;

module.exports = churchill;
