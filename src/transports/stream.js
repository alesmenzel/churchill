const format = require("../format");

/**
 * Synchronous logging to a stream
 *
 * @param {Object} opts Options
 * @param {Function} opts.format Formatting function
 * @param {Stream} opts.stream Stream
 */
function Stream(opts) {
  this.opts = opts;
  this.opts.format = this.opts.format || format.toText;
  this.stream = this.opts.stream;
}

/**
 * Log a Message
 *
 * @param {Object} info Message
 * @param {*} output (Optional) Output of the global formatting function
 */
Stream.prototype.log = function(info, output) {
  output = this.opts.format ? this.opts.format(info) : output;

  this.stream.write(output);
};

module.exports = Stream;
