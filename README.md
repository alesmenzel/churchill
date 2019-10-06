# Churchill (Work in Progress) 🚧

Simple to use, without overwhelming configuration NodeJS logging utility. Inspired by [winston](https://github.com/winstonjs/winston) and [debug](https://github.com/visionmedia/debug).

![churchill logger](./assets/sample-colorized.png)

## Installation

```bash
npm install @alesmenzel/churchill
```

## Table of contents

- [Churchill (Work in Progress) 🚧](#churchill-work-in-progress-%f0%9f%9a%a7)
  - [Installation](#installation)
  - [Table of contents](#table-of-contents)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Transports](#transports)
    - [Console](#console)
    - [File](#file)
    - [Stream](#stream)
    - [HTTP](#http)
    - [Socket](#socket)
  - [Customization](#customization)
    - [Custom Log Levels](#custom-log-levels)
    - [Custom Formats](#custom-formats)
    - [Custom transport](#custom-transport)
  - [Environmental Variables](#environmental-variables)
  - [Logging Uncaught Exceptions](#logging-uncaught-exceptions)
  - [Contributors](#contributors)
  - [License](#license)

## Setup

Setting up Churchill is easy. Simply call churchill with a list of transports and if you are happy
with the default formatting, you can create a namespace and start logging!

```js
const churchill = require("churchill");

// Setup the logger - returns a createLogger function
const createNamespace = churchill({
  transports: [
    new churchill.trasports.Console(),
    new churchill.trasports.File({ filename: "error.log", maxLevel: "error" }),
    new churchill.trasports.File({ filename: "combined.log" })
  ]
});


// Alternatively, if you you create the logger directly
const logger = churchill.createLogger({
  transports: [
    new churchill.trasports.Console(),
    new churchill.trasports.File({ filename: "error.log", maxLevel: "error" }),
    new churchill.trasports.File({ filename: "combined.log" })
  ],
  namespace: "worker:a"
})
```

## Usage

Once you setup the logger, you can start creating your namespaced loggers and start logging.

```js

// Global logger without a namespace (always enabled)
const logger = createNamespace();

logger.info("Global log message", { metadata: "no namespace" });
// [2019-10-06T13:04:54.022Z] INFO Global log message { metadata: 'no namespace' } +0ms
logger.warn("Global warning log message");
// [2019-10-06T13:04:54.025Z] WARN Global warning log message +0ms


// File worker-a.js
const loggerWorkerA = createNamespace("worker:a"); // namespace "worker:a"
loggerWorkerA.info("Log from A", { name: "Worker A", data: "Data for A" });
// [2019-10-06T13:04:54.026Z] worker:a INFO Log from A { name: 'Worker A', data: 'Data for A' } +0ms


// File worker-b.js
const loggerWorkerB = createNamespace("worker:b"); // namespace "worker:b"
const metadata = { from: "Worker B", time: Date.now() };
loggerWorkerB.info(metadata);
// [2019-10-06T13:04:54.027Z] worker:b INFO { from: 'Worker B', time: 1570367094027 } +0ms
loggerWorkerB.verbose("This will not be logged because the max log level is info");


// File worker-c.js
const loggerWorkerC = createNamespace("worker:c"); // namespace "worker:c"
loggerWorkerC.error("Worker C encountered an error", new Error("ERR!"));
// [2019-10-06T13:04:54.028Z] worker:c ERROR Worker C encountered an error Error: ERR!
//     at Object.<anonymous> (/Users/ales.menzel/dev/churchill/examples/console.js:33:54)
//     at Module._compile (internal/modules/cjs/loader.js:776:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:787:10)
//     at Module.load (internal/modules/cjs/loader.js:653:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:585:3)
//     at Function.Module.runMain (internal/modules/cjs/loader.js:829:12)
//     at startup (internal/bootstrap/node.js:283:19)
//     at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3) +0ms
```

The default log levels contiain 6 levels, that are ascending numerical values, where the lower the number the more important the log message is.

```js
const levels = {
  error: 0,
  warn: 1,
  info: 2, // Default maximum log level
  verbose: 3,
  debug: 4,
  silly: 5
};
```

## Transports

This is the list of currently supported transports. Check the [examples](./examples) folder to see their usage.

| Name                | Description                               | Example                                                                           |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| [Console](#console) | Log to console                            | `churchill.trasports.Console.create({ ... })`                                     |
| [File](#file)       | Log to a file                             | `churchill.trasports.File.create({ filename: "error.log", level: "error", ... })` |
| [Stream](#stream)   | Log to any arbitrary stream.              | `churchill.transports.Stream.create({ stream: <Stream> })`                        |
| [HTTP](#http)       | Log to a HTTP stream.                     | `churchill.transports.HTTP.create({ path: "https://domain.com/path" })`           |
| [Socket](#socket)\* | (\*`Not Implemented Yet`) Log to a socket | `churchill.transports.Socket.create({ host: "127.0.0.1", port: 1337, ... })`      |

### Console

Options:

| Option       | Description                       | Example                   |
| ------------ | --------------------------------- | ------------------------- |
| `errorLevel` | Max log level to stream to stderr | `{ errorLevel: "error" }` |

### File

Options:

| Option     | Description          | Example                     |
| ---------- | -------------------- | --------------------------- |
| `filename` | Filename to log into | `{ filename: "error.log" }` |

### Stream

Options:

| Option   | Description        | Example                                               |
| -------- | ------------------ | ----------------------------------------------------- |
| `stream` | Stream to log into | `{ stream: fs.createWriteStream("temp/stream.log") }` |

### HTTP

Options:

| Option    | Description                                                                                                                                                  | Example                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `method`  | HTTP method                                                                                                                                                  | `{ method: "POST" }`                                  |
| `url`     | URL                                                                                                                                                          | `{ url: "https://log.example.com" }`                  |
| `auth`    | Authentication, see [auth request options](https://www.npmjs.com/package/request#requestoptions-callback)                                                    | `{ auth: { username: "john", password: "xxxxx" } }`   |
| `headers` | HTTP headers                                                                                                                                                 | `{ headers: { "Content-Type": "application/json" } }` |
| `dataKey` | How to send the data (e.g. body, qs, json, form, formData). This will use the request appropriate body key, which sets required headers. Defaults to `json`. | `{ dataKey: "form" }`                                 |

### Socket

Not Implemented Yet (you can send a PR 😉 )

## Customization

### Custom Log Levels

You can also specify custom levels.

```js
const customLevels = {
  critical: 0,
  warning: 1,
  log: 2,
  debug: 3
};

const customColors = {
  critical: 'red',
  warning: 'orange',
  log: 'blue',
  debug: 'gray'
};

churchill({ levels: customLevels, colors: customColors });
```

Available colors are `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`. For more information check the [chalk](https://www.npmjs.com/package/chalk) package.

### Custom Formats

Churchill supports custom formatting functions. A formatting function accepts `info` (global format) or `info, output, logger` (transport format) objects which is the logged message, globally formatted message and the logger instance. The return value is what will be sent to transport streams.

```js
const util = require("util");

const customGlobalFormat = (info) => {
  return { ...info, logger: 'churchill' }
}

const customFormat = info => {
  const { namespace, timestamp, level, ms, args } = info;

  return `${namespace} ${level} ${util.format(...args)} +${ms}ms`;
};

const createLogger = churchill({
  format: customGlobalFormat,
  transports: [
    churchill.trasports.Console.create({ format: customFormat })
  ]
});

const loggerA = createLogger("worker:a");
const loggerB = createLogger("worker:b");
const loggerC = createLogger("worker:c");

loggerA.info("test", { metadata: "some info" });
// worker:a info test { metadata: 'some info' } +1ms
loggerB.info("test", { metadata: "some info" });
// worker:b info test { metadata: 'some info' } +0ms
loggerC.error("test", { metadata: "some info" });
// worker:c error test { metadata: 'some info' } +0ms
```

### Custom transport

A transport is a class with a log method. Log method arguments are `info`, `output` and `logger`, where info is the object with logged message, output is formatted message by the global format function and logger is the instance that logged the message. See [implementation](./src/transports) of transports for examples.

```js
const { Transport } = require('@alesmenzel/churchill')

// Here is a simple transport that logs to stdout and has option to provide a prefix
// Note: it does not correcly handle stream backpressure
class CustomTransport extends Transport {
  constructor(opts) {
    super(opts);
    const { prefix = "" } = opts
    this.prefix = prefix
  }

  /**
   * Log a Message
   * @param {Object} info Message
   * @param {*} [output] Output of the global formatting function
   * @param {Logger} logger Logger
   */
  log(info, output, logger) {
    const out =  this.format(info, output, logger)
    const prefixed = custom ? `${this.prefix}${out}` : out
    // Transport is also an EventEmitter, so you can emit events
    if (custom) {
      this.emit("some-event", info)
    }
    process.stdout.write(prefixed); // naively log to console
  }
}

// It is recommented to provide a factory to create your logger
CustomTransport.create = (opts) => {
  return new CustomTransport(opts)
}

module.exports = CustomTransport;
```

## Environmental Variables

You can change the funcionality of the logger by setting enviromental variables.

| Variable                | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `CHURCHILL_DEBUG`       | List of enabled namespaces separated by a comma, can be also used with wildcard (i.e. `worker:a*`) |
| `CHURCHILL_DEBUG_LEVEL` | Maximal level to log (i.e. `warn`)                                                                 |

## Logging Uncaught Exceptions

Simply add listener for the `uncaughtException` and log whatever you need.

```js
process.on("uncaughtException", err => {
  logger.error(err);
  // Note: if you use any asynchronous transport, you will need to wait till it is written before exiting the program
});

throw new Error("ERR!");
// [2018-08-02T21:07:51.549Z] ERROR Error: ERR!
//    at Object.<anonymous> (<path>:30:7)
//    at Module._compile (internal/modules/cjs/loader.js:689:30)
//    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
//    at Module.load (internal/modules/cjs/loader.js:599:32)
//    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
//    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
//    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
//    at startup (internal/bootstrap/node.js:266:19)
//    at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3) +0ms
```

## Contributors

Help us improve and be recognised!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/8976542?v=4" width="100px;"/><br /><sub><b>Aleš Menzel</b></sub>](https://github.com/alesmenzel)<br />[💻](https://github.com/alesmenzel/churchill/commits?author=alesmenzel "Code") [📖](https://github.com/alesmenzel/churchill/commits?author=alesmenzel "Documentation") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- ALL-CONTRIBUTORS-LIST: START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!

## License

This package is developed under the [MIT licence]('./LICENCE').
