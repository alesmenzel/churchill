const { CHURCHILL_DEBUG, CHURCHILL_DEBUG_LEVEL } = process.env;

const SEPARATOR = /[\s,]+/;

/**
 * Create a list of RegExp matches to test against for namespaces
 * @param {string} debug
 * @return {RegExp[]|null}
 */
function getNamespaces(debug) {
  if (debug === undefined) return null;
  return debug.split(SEPARATOR).reduce((acc, namespace) => {
    if (!namespace) return acc;
    const regex = new RegExp(`^${namespace.replace(/\*/g, ".*?")}$`);
    acc.push(regex);
    return acc;
  }, []);
}

const CHURCHILL_DEBUG_NAMESPACES = getNamespaces(CHURCHILL_DEBUG);

module.exports = {
  CHURCHILL_DEBUG,
  CHURCHILL_DEBUG_LEVEL,
  CHURCHILL_DEBUG_NAMESPACES
};
