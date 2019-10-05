const transports = require("./transports");
const format = require("./format");
const Logger = require("./logger");

/**
 * Sets up the churchill logger
 * @param {Object} [options] Options
 * @param {Function} [options.format] Formatting function
 * @param {Object} [options.levels] Levels
 * @param {Array<Object>} [options.transports] Transports
 * @param {Number} [options.maxLevel] Max logged level
 */
function churchill(options = {}) {
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

module.exports = churchill;
