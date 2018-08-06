const net = require("net");
const EventEmitter = require("events");

const format = require("../format");

/**
 * Synchronous logging to console (stdout/stderr streams)
 *
 * @param {Object} opts Options
 * @param {Function} opts.format Formatting function
 * @param {Boolean} opts.reconnect Enable reconnect
 * @param {Number} opts.timeout Reconnect timeout
 * @param {Boolean} opts.queue Enable queue
 * @param {Boolean|Number} opts.queueLimit Max number of messages stored in queue
 */
class Socket extends EventEmitter {
  constructor(opts) {
    super();

    this.opts = opts;
    this.opts.format = this.opts.format || format.toTerminal;
    this.opts.reconnect = this.opts.reconnect !== undefined ? this.opts.reconnect : true;
    this.opts.timeout = this.opts.timeout || 3000;
    this.opts.queue = this.opts.queue !== undefined ? this.opts.queue : true;
    this.opts.queueLimit = this.opts.queueLimit !== undefined ? this.opts.queueLimit : 100;

    this.queue = [];

    this.client = new net.Socket();

    this.client.on("error", this.onError.bind(this));
    this.client.on("close", this.onDisconnect.bind(this));

    this.connect();
  }

  connect() {
    const { port, host } = this.opts;

    this.client.connect(port, host, this.onConnect.bind(this));
  }

  /**
   * Handle connecting to the server
   */
  onConnect() {
    this.emit("connect");
    this.isConnected = true;

    // Handle queue
    while (this.queue.length) {
      this.log(...this.queue.pop());
    }
  }

  /**
   * Handle connection close
   */
  onDisconnect() {
    this.isConnected = false;
    this.emit("disconnect");

    if (!this.opts.reconnect) {
      return;
    }

    setTimeout(() => {
      this.connect();
    }, this.opts.timeout);
  }

  /**
   * Handle errors from socket
   *
   * @param {Error} err Error
   */
  onError(err) {
    this.emit("error", err);
  }

  /**
   * Log a Message
   *
   * @param {Object} info Message
   * @param {*} output (Optional) Output of the global formatting function
   */
  log(info, output) {
    output = this.opts.format ? this.opts.format(info) : output;

    if (!this.isConnected) {
      if (!this.opts.queue) {
        this.onError(new Error("cannot log message, socket is not connected"));
        return;
      }

      if (this.opts.queueLimit !== false && this.queue.length >= this.opts.queueLimit) {
        this.onError(new Error("queue is full"));
        return;
      }

      this.queue.push([info, output]);
      return;
    }

    this.client.write(output);
  }
}

module.exports = Socket;
