# Stream transport

Send your logged data to any arbitrary stream.

```bash
npm install @churchill/stream
```

## Usage

```js
const churchill = require("@churchill/core");
const Stream = require("@churchill/stream");

const stream = fs.createWriteStream("temp/stream.log");
stream.on("error", (err) => {
  // ... you should handle errors
});

const createNamespace = churchill({
  transports: [Stream.create({ stream })]
});

const logger = createNamespace("worker:1");
logger.info("...");
```

## Options

| Option     | Description                           | Example                                               |
| ---------- | ------------------------------------- | ----------------------------------------------------- |
| `stream`   | Stream to log into                    | `{ stream: fs.createWriteStream("temp/stream.log") }` |
| `format`   | Custom formatting function.           | `{ format: (info, out, logger) => ... }`              |
| `maxLevel` | Max level to log into this transport. | `{ maxLevel: "warn" }`                                |
