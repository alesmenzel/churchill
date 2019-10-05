const request = require("request");

const Transport = require("../transport");

class HTTP extends Transport {
  /**
   * HTTP Transport
   * @param {Object} opts Options
   * @param {String} opts.method Method
   * @param {String} opts.url URL
   * @param {Object} [opts.auth] Auth
   * @param {Object} [opts.headers] Headers
   * @param {Function} opts.makeRequest Headers
   * @param {Function} [opts.format] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   */
  constructor(opts) {
    super(opts);
    const { method, url, auth, headers, makeRequest } = opts;
    this.method = method;
    this.url = url;
    this.auth = auth;
    this.headers = headers;
    this.makeRequest = makeRequest;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   */
  log(info, output) {
    const out = this.format(info, output);
    const { method, url, auth, headers, makeRequest } = this;
    return request({
      method,
      url,
      headers,
      auth,
      ...makeRequest(out)
    });
  }
}

/**
 * HTTP Transport
 * @param {Object} opts Options
 * @param {String} opts.method Method
 * @param {String} opts.url URL
 * @param {Object} [opts.auth] Auth
 * @param {Object} [opts.headers] Headers
 * @param {Function} opts.makeRequest Headers
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max logging level
 */
HTTP.create = opts => {
  return new HTTP(opts);
};

module.exports = HTTP;
