const chalk = require("chalk");
const util = require("util");
const { identity, randomStableColor } = require("./utils");

/**
 * @typedef {import("./logger")} Logger
 */

/**
 * Colorize based on log level
 * (Based on predefined color scheme)
 * @param {Object<String,String>} colors
 * @param {String} level
 * @returns {Function} Colorize function
 */
function colorizeByLevel(colors, level) {
  // @ts-ignore: chalk
  return chalk.bold[colors[level]];
}

/**
 * Colorize based on namespace
 * (Uses double md5 hash for randomness and takes the first 6 characters)
 * @param {String} [namespace] Namespace
 * @returns {Function} Colorize function
 */
function colorizeByNamespace(namespace) {
  if (!namespace) return identity;
  const { r, g, b } = randomStableColor(namespace);
  // @ts-ignore: chalk
  return chalk.bold.rgb(r, g, b);
}

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
  // @ts-ignore: args > 1
  const msg = args.length ? ` ${util.format(...args)}` : "";
  const elapsed = ` +${ms}ms`;

  return `${time}${nmsp}${lvl}${msg}${elapsed}\n`;
};

/**
 * Formats log message for a terminal output
 * @param {Object} info Log message
 * @param {*} [output] Output of the global formatting function
 * @param {Logger} logger Logger
 * @returns {String} Text representation of the logged message
 */
const toTerminal = (info, output, logger) => {
  const { namespace, level, timestamp, ms, args } = info;
  const colorizeNamespace = colorizeByNamespace(namespace);
  const colorizeLevel = colorizeByLevel(logger.colors, level);
  // @ts-ignore: chalk
  const time = chalk.gray(`[${new Date(timestamp).toISOString()}]`);
  const nmsp = namespace ? ` ${colorizeNamespace(namespace)}` : "";
  const lvl = ` ${colorizeLevel(level.toUpperCase())}`;
  // @ts-ignore: chalk, args > 1
  const msg = args.length ? ` ${chalk.gray(util.format(...args))}` : "";
  const elapsed = ` ${colorizeNamespace(`+${ms}ms`)}`;

  return `${time}${nmsp}${lvl}${msg}${elapsed}\n`;
};

module.exports = {
  toText,
  toTerminal
};
