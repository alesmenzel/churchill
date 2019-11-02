const { stringify } = require("@churchill/utils");

/**
 * Formats log message for a plain text output
 * @param {Object} info Log message
 * @returns {String} Text representation of the logged message
 */
const toText = info => {
  const { namespace = "", level = "", timestamp, ms, args } = info;

  const time = `[${new Date(timestamp).toISOString()}]`;
  const nmsp = namespace ? ` ${namespace}` : "";
  const lvl = ` ${level.toUpperCase()}`;
  const msg = args.length ? ` ${stringify(args)}` : "";
  const elapsed = ` +${ms}ms`;

  return `${time}${nmsp}${lvl}${msg}${elapsed}\n`;
};

module.exports = toText;
