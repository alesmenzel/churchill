# Churchill

Simple to use (no overwhelming configuration) NodeJS logging utility. Inspired by [winston](https://github.com/winstonjs/winston) and [debug](https://github.com/visionmedia/debug).

![churchill logger](./assets/sample-colorized.png)

## Installation

```bash
npm install @alesmenzel/churchill
```

## Quick links

- [Churchill](#churchill)
  - [Installation](#installation)
  - [Quick links](#quick-links)
  - [Setup](#setup)
  - [Transports](#transports)
    - [Console](#console)
    - [File](#file)
    - [Stream](#stream)
    - [HTTP](#http)
  - [Elastic](#elastic)
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
with the default formatting, you can use the logger in your services.

```js
// logger.js
const churchill = require("churchill");

const { Console, File } = churchill.trasports;

const createNamespace = churchill({
  transports: [
    Console.create(),
    File.create({ filename: "error.log", maxLevel: "error" }),
    File.create({ filename: "combined.log" })
  ]
});
```

Here is an example service:

```js
// worker-a.js
const logger = require('./logger')('worker:a')
logger.error('Got an error!', new Error('Err!'))
logger.warn('Ups?')
logger.info('Log me with some data!', { here: { are: 'some metadata' }})
// the default max log level is info (anything below will not be logged by default)
logger.verbose('Hello!')
logger.debug( ... )
logger.silly( ... )
```

The default log levels contiain 6 levels, that are ascending numerical values, where the lower the number the more important the log message is.

```js
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2, // Default maximum log level
  verbose: 3,
  debug: 4,
  silly: 5
};
```

## Transports

This is the list of currently supported transports. Check the [examples](./examples) folder to see their usage. (Note that all transports are exported under `churchill.trasports.<Transport>`)

| Name                  | Description                               | Example                                                                 |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| [Console](#console)   | Log to console                            | `Console.create({ ... })`                                               |
| [File](#file)         | Log to a file                             | `File.create({ filename: "error.log", level: "error", ... })`           |
| [Stream](#stream)     | Log to any arbitrary stream.              | `Stream.create({ stream: <Stream> })`                                   |
| [HTTP](#http)         | Log to a HTTP stream.                     | `HTTP.create({ path: "https://domain.com/path" })`                      |
| [Elastic](#elastic)\* | Log to an elasticsearch index.            | `Elastic.create({ node: "http://localhost:9200", index: "logs", ... })` |
| [Socket](#socket)\*   | (\*`Not Implemented Yet`) Log to a socket | `Socket.create({ host: "127.0.0.1", port: 1337, ... })`                 |

### Console

Log to a terminal. Uses chalk to colorize the output. By setting the `errorLevel` you can change which levels are logged to the standard error (stderr) instead of standard output (stdout). Usually best for local development.

![console](./assets/example-console.png)

Options:

| Option       | Description                           | Example                                  |
| ------------ | ------------------------------------- | ---------------------------------------- |
| `errorLevel` | Max log level to stream to stderr     | `{ errorLevel: "error" }`                |
| `format`     | Custom formatting function.           | `{ format: (info, out, logger) => ... }` |
| `maxLevel`   | Max level to log into this transport. | `{ maxLevel: "warn" }`                   |

### File

Log to a file on the same machine. You must specify a `filename` where to store the logs. Note that the folder must exists before hand.

![file](./assets/example-file.png)

Options:

| Option     | Description                           | Example                                  |
| ---------- | ------------------------------------- | ---------------------------------------- |
| `filename` | Filename to log into                  | `{ filename: "error.log" }`              |
| `format`   | Custom formatting function.           | `{ format: (info, out, logger) => ... }` |
| `maxLevel` | Max level to log into this transport. | `{ maxLevel: "warn" }`                   |

### Stream

Log to any arbitrary stream.

Options:

| Option     | Description                           | Example                                               |
| ---------- | ------------------------------------- | ----------------------------------------------------- |
| `stream`   | Stream to log into                    | `{ stream: fs.createWriteStream("temp/stream.log") }` |
| `format`   | Custom formatting function.           | `{ format: (info, out, logger) => ... }`              |
| `maxLevel` | Max level to log into this transport. | `{ maxLevel: "warn" }`                                |

### HTTP

Log to a http endpoint. You must install `request` and `request-promise-native`.

```bash
npm i request request-promise-native
```

Options:

| Option     | Description                                                                                                                                                  | Example                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `method`   | HTTP method                                                                                                                                                  | `{ method: "POST" }`                                  |
| `url`      | URL                                                                                                                                                          | `{ url: "https://log.example.com" }`                  |
| `auth`     | Authentication, see [auth request options](https://www.npmjs.com/package/request#requestoptions-callback)                                                    | `{ auth: { username: "john", password: "xxxxx" } }`   |
| `headers`  | HTTP headers                                                                                                                                                 | `{ headers: { "Content-Type": "application/json" } }` |
| `dataKey`  | How to send the data (e.g. body, qs, json, form, formData). This will use the request appropriate body key, which sets required headers. Defaults to `json`. | `{ dataKey: "form" }`                                 |
| `format`   | Custom formatting function.                                                                                                                                  | `{ format: (info, out, logger) => ... }`              |
| `maxLevel` | Max level to log into this transport.                                                                                                                        | `{ maxLevel: "warn" }`                                |

## Elastic

In order to log to elastic, first install the elasticsearch library.

```bash
npm i @elastic/elasticsearch@7.x
```

| Option     | Description                                      | Example                                  |
| ---------- | ------------------------------------------------ | ---------------------------------------- |
| `client`   | Elasticsearch client (or just pass a `node` URL) | `new Client({ node: "..." })`            |
| `node`     | Elasticsearch node URL                           | `{ node: "http://localhost:9200" }`      |
| `index`    | Index where to store logs.                       | `churchill-log`                          |
| `format`   | Custom formatting function.                      | `{ format: (info, out, logger) => ... }` |
| `maxLevel` | Max level to log into this transport.            | `{ maxLevel: "warn" }`                   |

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
  critical: "red",
  warning: "orange",
  log: "blue",
  debug: "gray"
};

churchill({ levels: customLevels, colors: customColors });
```

Available colors are `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`. For more information check the [chalk](https://www.npmjs.com/package/chalk) package.

### Custom Formats

Churchill supports custom formatting functions. A formatting function accepts `info` (global format) or `info, output, logger` (transport format) objects which is the logged message, globally formatted message and the logger instance. The return value is what will be sent to transport streams.

```js
const util = require("util");

const customGlobalFormat = info => {
  return { ...info, logger: "churchill:" };
};

const customFormat = info => {
  const { logger, namespace, timestamp, level, ms, args } = info;

  return `${logger}${namespace} ${level} ${args.map(arg => util.format(arg)).join(" ")} +${ms}ms`;
};

const createLogger = churchill({
  format: customGlobalFormat,
  transports: [Console.create({ format: customFormat })]
});

const loggerA = createLogger("worker:a");
const loggerB = createLogger("worker:b");
const loggerC = createLogger("worker:c");

loggerA.info("test", { metadata: "some info" });
// churchill:worker:a info test { metadata: 'some info' } +1ms
loggerB.info("test", { metadata: "some info" });
// churchill:worker:b info test { metadata: 'some info' } +0ms
loggerC.error("test", { metadata: "some info" });
// churchill:worker:c error test { metadata: 'some info' } +0ms
```

### Custom transport

A transport is a class with a log method. Log method arguments are `info`, `output` and `logger`, where info is the object with logged message, output is formatted message by the global format function and logger is the instance that logged the message. See [implementation](./src/transports) of transports for examples.

```js
const { Transport } = require("@alesmenzel/churchill");

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

## Environmental Variables

You can change the funcionality of the logger by setting enviromental variables.

| Variable                | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `CHURCHILL_DEBUG`       | List of enabled namespaces separated by a comma, can be also used with wildcard (i.e. `worker:a*`) |
| `CHURCHILL_DEBUG_LEVEL` | Max. level to log (i.e. `debug`)                                                                   |

## Logging Uncaught Exceptions

Simply add listener for the `uncaughtException` and log whatever you need.

```js
process.on("uncaughtException", err => {
  logger.error(err);
  // Note: if you use any asynchronous transport, you will need to wait till it is written before exiting the program
});
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
