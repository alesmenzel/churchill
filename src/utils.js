const { DEBUG, DEBUG_NAMESPACES } = require("./config");

/**
 * Check if value is set
 * @param {*} value Value
 */
function isset(value) {
  return value !== undefined;
}

/**
 * Check if namespace is enabled
 * @param {String} input Namespace
 */
function isNamespaceEnabled(input) {
  if (!isset(DEBUG)) return true;
  return DEBUG_NAMESPACES.some(namespace => input.match(namespace));
}

module.exports = { isset, isNamespaceEnabled };
