const format = require("../format");

function Console(opts) {
  this.opts = opts;
  this.opts.format = this.opts.format || format.toTerminal;
}

Console.prototype.log = function(info, output) {
  const { priority } = info;

  output = this.opts.format ? this.opts.format(info) : output;

  if (priority === 0) {
    return process.stderr.write(output);
  }

  return process.stdout.write(output);
};

module.exports = Console;
