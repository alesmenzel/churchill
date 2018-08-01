const fs = require("fs");

function File(opts) {
  this.opts = opts;

  this.stream = fs.createWriteStream(opts.filename, { flags: "a" });
}

File.prototype.log = function(output, info) {
  output = this.opts.format ? this.opts.format(info) : output;

  this.stream.write(output);
};

module.exports = File;
