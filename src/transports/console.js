function Console(opts) {
  this.opts = opts;
}

Console.prototype.log = (output, { priority }) => {
  if (priority === 0) {
    return process.stderr.write(output);
  }

  return process.stdout.write(output);
};

module.exports = Console;
