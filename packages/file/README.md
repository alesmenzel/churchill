# File transport

Log to a file on the same machine. You must specify a `filename` where to store the logs. Note that the folder must exists before hand.

![file](./assets/example-file.png)

```bash
npm install @churchill/file
```

## Usage

```js
const churchill = require("@churchill/core");
const File = require("@churchill/file");

const errorFileLog = File.create({ filename: "temp/error.log", maxLevel: "error" }),
fileTransport.on("error", (err) => {
  // ... you should handle errors
});

const combinedFileLog = File.create({ filename: "temp/combined.log", maxLevel: "info" })
combinedFileLog.on("error", (err) => {
  // ... you should handle errors
});

const createNamespace = churchill({
  transports: [errorFileLog, combinedFileLog]
});

const logger = createNamespace("worker:1");
logger.info("...");
```

## Options

| Option     | Description                           | Example                                  |
| ---------- | ------------------------------------- | ---------------------------------------- |
| `filename` | Filename to log into                  | `{ filename: "error.log" }`              |
| `format`   | Custom formatting function.           | `{ format: (info, out, logger) => ... }` |
| `maxLevel` | Max level to log into this transport. | `{ maxLevel: "warn" }`                   |

## Events

| Name    | Params               | Description                                                                                     |
| ------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| `error` | `error: Error`       | Emited when the destination emits an Error or there is backpressure from the destination stream |
| `drain` | `streamName: string` | When the destination stream is able to accept new messages                                      |

## Methods

| Name             | Description                   |
| ---------------- | ----------------------------- |
| `end(): Promise` | Closes the destination stream |
