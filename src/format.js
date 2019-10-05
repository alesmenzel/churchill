const chalk = require("chalk");
const crypto = require("crypto");
const supportsColor = require("supports-color");
const util = require("util");

// Check if terminal supports at least basic color
const color = supportsColor.stdout && supportsColor.stderr;

// Default color scheme
const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  verbose: "cyan",
  debug: "green",
  silly: "white"
};

/**
 * Creates an MD5 hash from string input
 * @param {String} str Input
 */
const md5 = str =>
  crypto
    .createHash("md5")
    .update(str)
    .digest("hex");

/**
 * Colorize based on log level
 * (Based on predefined color scheme)
 * @param {*} level
 * @returns {Function} Colorize function
 */
const colorizeByLevel = level => chalk[colors[level.toLowerCase()]];

/**
 * Colorize based on namespace
 * (Uses md5 hash for randomness and takes the first 6 characters)
 * @param {String} namespace Namespace
 * @returns {Function} Colorize function
 */
const colorizeByNamespace = namespace => chalk.hex(`#${md5(namespace).slice(0, 6)}`);

/**
 * Formats log message for a plain text output
 *
 * @param {Object} info Log message
 * @returns {String} Text representation of the logged message
 */
const toText = info => {
  const { namespace = "", level = "", timestamp, ms, args } = info;

  const time = `[${new Date(timestamp).toISOString()}]`;
  const nmsp = namespace ? ` ${namespace}` : "";
  const lvl = ` ${level.toUpperCase()}`;
  const msg = args.length ? ` ${util.format(...args)}` : "";
  const elapsed = ` +${ms}ms`;

  return `${time}${nmsp}${lvl}${msg}${elapsed}\n`;
};

/**
 * Formats log message for a terminal output
 *
 * @param {Object} info Log message
 * @returns {String} Text representation of the logged message
 */
const toTerminal = info => {
  if (!color) {
    return toText(info);
  }

  const { namespace = "", level = "", timestamp, ms, args } = info;

  const namespaceColor = namespace ? colorizeByNamespace(namespace) : i => i;
  const levelColor = colorizeByLevel(level);

  const time = chalk.gray(`[${new Date(timestamp).toISOString()}]`);
  const nmsp = namespace ? ` ${namespaceColor(namespace)}` : "";
  const lvl = ` ${levelColor(level.toUpperCase())}`;
  const msg = args.length ? ` ${chalk.gray(util.format(...args))}` : "";
  const elapsed = ` ${namespaceColor(`+${ms}ms`)}`;

  return `${time}${nmsp}${lvl}${msg}${elapsed}\n`;
};

module.exports = {
  colorizeByLevel,
  colorizeByNamespace,
  toText,
  toTerminal
};
