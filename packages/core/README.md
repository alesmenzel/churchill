# Churchill Core

Churchill core is the actuall logger. By default we include `@churchill/console` as the default transport, but you might want to install additional transports like `file`, `elastic`, `http` or `socket`.

## Installation

```bash
npm install @churchill/core
# or if you want to log to different transport then the default
npm install @churchill/core @churchill/console
npm install @churchill/core @churchill/file
npm install @churchill/core @churchill/elastic
# ...
```

## Setup

Setting up Churchill is easy. Simply call churchill with a list of transports and if you are happy
with the default formatting, you can use the logger in your services.

```js
// logger.js
const churchill = require("@churchill/core");
const Console = require("@churchill/console");
const File = require("@churchill/file");

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

The default log levels contains 6 levels, that are ascending numerical values, where the lower the number the more important the log message is.

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

| Name                    | Description                               | Example                                                                 |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| [Console](../console)   | Log to console                            | `Console.create({ errorLevel: "error", ... })`                          |
| [File](../file)         | Log to a file                             | `File.create({ filename: "error.log", level: "error", ... })`           |
| [Stream](../stream)     | Log to any arbitrary stream.              | `Stream.create({ stream: <Stream>, ... })`                              |
| [HTTP](../http)         | Log to a HTTP stream.                     | `HTTP.create({ path: "https://domain.com/path", ... })`                 |
| [Elastic](../elastic)\* | Log to an elasticsearch index.            | `Elastic.create({ node: "http://localhost:9200", index: "logs", ... })` |
| [Socket](../socket)\*   | (\*`Not Implemented Yet`) Log to a socket | `Socket.create({ host: "127.0.0.1", port: 1337, ... })`                 |

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

For implementing custom transport please see [transport](../transport) package.

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
