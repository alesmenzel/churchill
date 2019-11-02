# Transport

All transports for churchill should extend this base class.

```bash
npm install @churchill/transport
```

## Implementing own transport

A transport is a class with a log method. Log method arguments are `info`, `output` and `logger`, where info is the object with logged message, output is formatted message by the global format function and logger is the instance that logged the message. See [implementation](./src/transports) of transports for examples.

```js
const { Transport } = require("@churchill/transport");

// Here is a simple transport that logs to stdout and has option to provide a prefix
// Note: it does not correcly handle stream backpressure
class CustomTransport extends Transport {
  constructor(opts) {
    super(opts);
    const { prefix = "" } = opts;
    this.prefix = prefix;
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   * @param {Logger} logger Logger
   */
  async log(info, output, logger) {
    const out = this.format(info, output, logger);
    const prefixed = custom ? `${this.prefix}${out}` : out;
    // Transport is also an EventEmitter, so you can emit events
    if (custom) {
      this.emit("some-event", info);
    }
    process.stdout.write(prefixed); // naively log to console
  }
}

// It is recommented to provide a factory to create your logger
CustomTransport.create = opts => {
  return new CustomTransport(opts);
};

module.exports = CustomTransport;
```

## Publishing your transport

By convention you should name your transport as `churchill-<transport>`.
