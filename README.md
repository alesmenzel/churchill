# Churchill

Light and simple to use logger for Node. Inspired by [winston](https://github.com/winstonjs/winston) and [debug](https://github.com/visionmedia/debug).

![churchill logger](./assets/sample-colorized.png)

## Installation

See the [@churchill/core](./packages/core) readme.

## Transports

| Transport is a **destination**, where you can store your logs.

This is the list of currently supported transports. Check the [examples](./examples) folder to see their usage.

| *Note you must install the transports separately*

| Name                          | Description                               | Example                                                                 |
| ----------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| [Console](./packages/console) | Log to console                            | `Console.create({ ... })`                                               |
| [File](./packages/file)       | Log to a file                             | `File.create({ filename: "error.log", level: "error", ... })`           |
| [Stream](./packages/stream)   | Log to any arbitrary stream.              | `Stream.create({ stream: <Stream> })`                                   |
| [HTTP](./packages/http)       | Log to a HTTP stream.                     | `HTTP.create({ path: "https://domain.com/path" })`                      |
| [Elastic](./packages/elastic) | Log to an elasticsearch index.            | `Elastic.create({ node: "http://localhost:9200", index: "logs", ... })` |
| [Socket](./packages/socket)\* | (\*`Not Implemented Yet`) Log to a socket | `Socket.create({ host: "127.0.0.1", port: 1337, ... })`                 |

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
