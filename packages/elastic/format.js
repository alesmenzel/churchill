const { stringify } = require("@churchill/utils");

/**
 * Formats log message for a elasticsearch
 * @param {Object} info
 */
function toElastic(info) {
  const { namespace = "", level, timestamp, args } = info;
  return {
    level,
    namespace,
    timestamp,
    // @ts-ignore: args > 0
    message: stringify(args)
  };
}

module.exports = toElastic;
