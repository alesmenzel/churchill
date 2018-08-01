function Console(opts) {
  this.opts = opts;
}

Console.prototype.log = function(output, info) {
  const { priority } = info;

  output = this.opts.format ? this.opts.format(info) : output;

  if (priority === 0) {
    return process.stderr.write(output);
  }

  return process.stdout.write(output);
};

module.exports = Console;
