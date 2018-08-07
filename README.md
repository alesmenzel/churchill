# Churchill (Work in Progress) 🚧

Simple to use, without overwhelming configuration NodeJS logging utility. Inspired by [winston](https://github.com/winstonjs/winston) and [debug](https://github.com/visionmedia/debug).

![churchill logger](./assets/sample-colorized.png)

## Installation

```bash
npm install @alesmenzel/churchill
```

## Table of contents

* [Setup](#setup)
* [Usage](#usage)
* [Transports](#transports)
  * [Console](#console)
  * [File](#console)
  * [Stream](#stream)
  * [Socket](#socket)
  * [HTTP](#http)
* [Customization](#customization)
  * [Custom Logging Levels](#custom-log-levels)
  * [Custom Formats](#creating-custom-formats)
  * [Custom Transport](#custom-transport)
* [Environmental Variables](#environmental-variables)
* [Handling Uncaught Exceptions with winston](#logging-uncaught-exceptions)

## Setup

Setting up Churchill is easy. Simply call churchill with a list of transports and if you are happy
with the default formatting, you are done and can start logging!

```js
const churchill = require("churchill");

// Setup the logger - returns a createLogger function
const createLogger = churchill({
  transports: [
    new churchill.trasports.Console(),
    new churchill.trasports.File({ filename: "error.log", level: "error" }),
    new churchill.trasports.File({ filename: "combined.log" })
  ]
});
```

## Usage

Once you setup the logger, you can start creating your namespaced loggers and start logging.

```js
const loggerA = createLogger("worker:a"); // namespace "worker:a"
const loggerB = createLogger("worker:b"); // namespace "worker:b"
const loggerC = createLogger("worker:c"); // namespace "worker:c"

loggerA.info("test", { metadata: "some info" });
// [2018-08-02T21:07:51.544Z] worker:a INFO test +1ms
// { metadata: 'some info' }
loggerB.info("test", { metadata: "some info" });
// [2018-08-02T21:07:51.548Z] worker:b INFO test +0ms
// { metadata: 'some info' }
loggerC.error("test", { metadata: "some info" }, new Error("ERR!"));
// [2018-08-02T21:07:51.548Z] worker:c ERROR test +0ms
// { metadata: 'some info' } Error: ERR!
//    at Object.<anonymous> (<path>:23:50)
//    at Module._compile (internal/modules/cjs/loader.js:689:30)
//    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
//    at Module.load (internal/modules/cjs/loader.js:599:32)
//    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
//    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
//    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
//    at startup (internal/bootstrap/node.js:266:19)
//    at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3)
```

The default log levels contiain 6 levels, that are ascending numerical values, where the lower the number the more important the log message is.

```js
const levels = {
  error: 0,
  warn: 1,
  info: 2, // Default minimum log level
  verbose: 3,
  debug: 4,
  silly: 5
};
```

## Transports

This is the list of currently supported transports. Check the [examples](./examples) folder to see their usage.

| Name    | Description                                                                                                                                                                                                                                                                                                                             | Example                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Console | Log to console                                                                                                                                                                                                                                                                                                                          | `new churchill.trasports.Console()`                                       |
| File    | Log to a file                                                                                                                                                                                                                                                                                                                           | `new churchill.trasports.File({ filename: "error.log", level: "error" })` |
| Socket  | Log to a socket, note that the implementation uses an internal buffer to store messages before the socket connection is estabilished. This can cause out of memory (OOM) crashes when too many messages are buffered. (It is recommended to set the max. amount of stored messages in the buffer to prevent this, default limit is 100) | `new churchill.transports.Socket({ host: "127.0.0.1", port: 1337 })`      |
| Stream  | Log to any arbitrary stream.                                                                                                                                                                                                                                                                                                            | `new churchill.transports.Stream({ stream: <Stream> })`                   |
| HTTP\*  | (\*`Not Implemented Yet`) Log to a HTTP stream.                                                                                                                                                                                                                                                                                         | `new churchill.transports.HTTP({ path: "https://domain.com/path" })`      |

### Console

### File

### Stream

### Socket

### HTTP

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

Churchill supports custom formatting functions. A formatting function accepts `info` object which is the logged message and should return value that will be sent to transport streams.

```js
const util = require("util");

const customFormat = info => {
  const { namespace, timestamp, level, ms, args } = info;

  return `${namespace} ${level} ${util.format(...args)} +${ms}ms`;
};

const createLogger = churchill({
  transports: [new churchill.trasports.Console({ format: customFormat })]
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

A transport is a function with a log method. Log method accepts `info` and `output`, where info is the object with logged message and output is formatted message by the global format function. See [implementation](./src/transports) of transports for examples.

```js
class CustomTransport {
  constructor(opts) {
    super();

    this.opts = opts;
  }

  /**
   * Log a Message
   *
   * @param {Object} info Message
   * @param {*} output (Optional) Output of the global formatting function
   */
  log(info, output) {
    process.stdout.write(output); // Log to console
  }
}

module.exports = CustomTransport;
```

## Environmental Variables

You can change the funcionality of the logger by setting enviromental variables.

| Variable                | Description                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `CHURCHILL_DEBUG`       | List of enabled namespaces separated by a comma, can be also used with wildcard (i.e. `worker:a:*`) |
| `CHURCHILL_DEBUG_LEVEL` | Minimal level to log (i.e. `warn`)                                                                  |

```js
logger.silly("test", { metadata: "some info" });
// Not logged - CHURCHILL_DEBUG_LEVEL is set to 'debug'
logger.debug("test", { metadata: "some info" });
// Not logged - transport Console is set to 'verbose'
logger.verbose("test", { metadata: "some info" });
// [2018-08-01T19:46:47.582Z] namespace:test VERBOSE test { metadata: 'some info' } +0ms
logger.info("test", { metadata: "some info" });
// [2018-08-01T19:46:47.582Z] namespace:test INFO test { metadata: 'some info' } +0ms
logger.warn("test", { metadata: "some info" });
// [2018-08-01T19:46:47.582Z] namespace:test WARN test { metadata: 'some info' } +0ms
logger.error("test", { metadata: "some info" }, new Error("ERR!"));
// [2018-08-01T19:46:47.582Z] namespace:test ERROR test { metadata: 'some info' } Error: ERR!
//     at Object.<anonymous> (<path>:37:32)
//     at Module._compile (internal/modules/cjs/loader.js:689:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
//     at Module.load (internal/modules/cjs/loader.js:599:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:530:3)
//     at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
//     at startup (internal/bootstrap/node.js:266:19)
//     at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3) +0ms
```

## Logging Uncaught Exceptions

Simply add listener for the `uncaughtException` and log whatever you need.

```js
const logger = createLogger(); // Global logger - always enabled

process.on("uncaughtException", err => {
  logger.error(err);
  process.exit(1);
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
