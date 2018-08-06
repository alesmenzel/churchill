const format = require("../format");

/**
 * Synchronous logging to console (stdout/stderr streams)
 *
 * @param {Object} opts Options
 * @param {Function} opts.format Formatting function
 */
function Console(opts) {
  this.opts = opts;
  this.opts.format = this.opts.format || format.toTerminal;
}

/**
 * Log a Message
 *
 * @param {Object} info Message
 * @param {*} output (Optional) Output of the global formatting function
 */
Console.prototype.log = function(info, output) {
  const { priority } = info;

  output = this.opts.format ? this.opts.format(info) : output;

  if (priority === 0) {
    return process.stderr.write(output);
  }

  return process.stdout.write(output);
};

module.exports = Console;
