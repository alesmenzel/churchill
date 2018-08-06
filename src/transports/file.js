const fs = require("fs");

const format = require("../format");

/**
 * Synchronous logging to a file
 *
 * @param {Object} opts Options
 * @param {Function} opts.format Formatting function
 * @param {String} opts.filename Filename
 */
function File(opts) {
  this.opts = opts;
  this.opts.format = this.opts.format || format.toText;
  this.stream = fs.createWriteStream(opts.filename, { flags: "a" });
}

/**
 * Log a Message
 *
 * @param {Object} info Message
 * @param {*} output (Optional) Output of the global formatting function
 */
File.prototype.log = function(info, output) {
  output = this.opts.format ? this.opts.format(info) : output;

  this.stream.write(output);
};

module.exports = File;
