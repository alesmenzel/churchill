const request = require("request-promise-native");
const Transport = require("@churchill/transport");

/**
 * @typedef {import("@churchill/core")} Logger
 */

class HTTP extends Transport {
  /**
   * HTTP Transport
   * @param {Object} opts Options
   * @param {Function} [opts.format] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   * @param {String} opts.method Method
   * @param {String} opts.url URL
   * @param {Object} [opts.auth] Auth
   * @param {Object} [opts.headers] Headers
   * @param {String} [opts.dataKey="json"] Data key (e.g. body, qs, json, form, formData)
   */
  constructor(opts) {
    const { format, maxLevel, dataKey = "json", ...rest } = opts;
    super({ format, maxLevel });
    this.dataKey = dataKey;
    this.requestOptions = rest;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   * @param {Logger} logger Logger
   */
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    const { dataKey, requestOptions } = this;
    let res;
    try {
      res = await request({
        [dataKey]: out,
        ...requestOptions
      });
    } catch (err) {
      this.emit("error", err);
      return null;
    }
    return res;
  }
}

/**
 * HTTP Transport
 * @param {Object} opts Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max logging level
 * @param {String} opts.method Method
 * @param {String} opts.url URL
 * @param {Object} [opts.auth] Auth
 * @param {Object} [opts.headers] Headers
 * @param {String} [opts.dataKey] Data key (e.g. body, qs, json, form, formData)
 */
HTTP.create = opts => {
  return new HTTP(opts);
};

module.exports = HTTP;
