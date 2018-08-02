const fs = require("fs");

const format = require("../format");

function File(opts) {
  this.opts = opts;
  this.opts.format = this.opts.format || format.toText;
  this.stream = fs.createWriteStream(opts.filename, { flags: "a" });
}

File.prototype.log = function(info, output) {
  output = this.opts.format ? this.opts.format(info) : output;

  this.stream.write(output);
};

module.exports = File;
