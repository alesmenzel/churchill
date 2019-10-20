const { Client } = require("@elastic/elasticsearch");

const { toElastic } = require("../format");
const Transport = require("../transport");

/**
 * @typedef {import("@elastic/elasticsearch").Client} ElasticClient
 * @typedef {import("../logger")} Logger
 */

class Elastic extends Transport {
  /**
   * Logging to Elasticsearch index
   * @param {Object} opts Options
   * @param {Function} [opts.format=toElastic] Formatting function
   * @param {String} [opts.maxLevel] Max logging level
   * @param {ElasticClient} [opts.client] Elastic client
   * @param {String} [opts.node] Elastic node URL
   * @param {String} opts.index Index
   */
  constructor(opts) {
    super({ ...opts, format: opts.format || toElastic });
    const { client, index, node } = opts;

    if (!client) {
      if (!node) {
        throw new Error("You must provide node, did you forget to pass options.node?");
      }

      this.client = new Client({ node });
    } else {
      this.client = client;
    }

    if (!index) {
      throw new Error("You must provide index, did you forget to pass options.index?");
    }

    this.index = index;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} output (Optional) Output of the global formatting function
   * @param {Logger} logger Logger
   */
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    return this.client.index({
      index: this.index,
      body: out
    });
  }
}

/**
 * Create a Elasticsearch transport
 * @param {Object} opts Options
 * @param {Function} [opts.format] Formatting function
 * @param {String} [opts.maxLevel] Max logging level
 * @param {ElasticClient} [opts.client] Elastic client
 * @param {String} [opts.node] Elastic node URL
 * @param {String} opts.index Index
 */
Elastic.create = opts => {
  return new Elastic(opts);
};

module.exports = Elastic;
