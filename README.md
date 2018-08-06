# Churchill (Work in Progress) 🚧

Simple to use, without overwhelming configuration NodeJS logging utility. Inspired by [winston](https://github.com/winstonjs/winston) and [debug](https://github.com/visionmedia/debug).

![churchill logger](./assets/sample-colorized.png)

## Installation

```bash
npm install churchill
```

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

## Transports

This is the list of currently supported transports. Check the [examples](./examples) folder to see their usage.

| Name     | Description                                 | Example|
| -------- | ------------------------------------------- |-|
| Console  | Log to console                              | `new churchill.trasports.Console()` |
| File     | Log to a file                               | `new churchill.trasports.File({ filename: "error.log", level: "error" })` |
| Socket   | Log to a socket, note that the implementation uses an internal buffer to store messages before the socket connection is estabilished. This can cause out of memory (OOM) crashes when too many messages are buffered. (It is recommended to set the max. amount of stored messages in the buffer to prevent this, default limit is 100)                            | `new churchill.transports.Socket({ host: "127.0.0.1", port: 1337 })` |
| Stream | Log to any arbitrary stream. | `new churchill.transports.Stream({ stream: <Stream> })` |
| HTTP* | (*`Not Implemented Yet`) Log to a HTTP stream. | `new churchill.transports.HTTP({ path: "https://domain.com/path" })` |

## Logging uncaught exception

Simply add listener for the `uncaughtException` and log whatevet you need.

```js
const logger = createLogger(); // Global logger - always enabled

process.on("uncaughtException", err => {
  logger.error(err);
  process.exit(1);
});

throw new Error("ERR!");
// [2018-08-02T21:07:51.549Z] ERROR Error: ERR!
//    at Object.<anonymous> (C:\Projects\churchill\examples\setup.js:30:7)
//    at Module._compile (internal/modules/cjs/loader.js:689:30)
//    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
//    at Module.load (internal/modules/cjs/loader.js:599:32)
//    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
//    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
//    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
//    at startup (internal/bootstrap/node.js:266:19)
//    at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3) +0ms
```

## Custom formats

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

## Enviromental variables

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
//     at Object.<anonymous> (C:\Projects\churchill\test\index.js:37:32)
//     at Module._compile (internal/modules/cjs/loader.js:689:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
//     at Module.load (internal/modules/cjs/loader.js:599:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:530:3)
//     at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
//     at startup (internal/bootstrap/node.js:266:19)
//     at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3) +0ms
```

## License

This package is developed under the [MIT licence]('./LICENCE').
