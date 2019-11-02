# Elastic transport

Index your logged data to elasticsearch.

```bash
npm install @churchill/elastic @elastic/elasticsearch@^7.0.0
```

## Usage

```js
const churchill = require("@churchill/core");
const Elastic = require("@churchill/elastic");

const elasticTransport = Elastic.create({
  node: "http://localhost:9200",
  index: "churchill-logs",
  format: info => ({
    level: info.level,
    namespace: info.namespace,
    timestamp: info.timestamp,
    payload: JSON.stringify(info.args)
  })
})
elasticTransport.on("error", (err) => {
  // ... you should handle errors
});

const createNamespace = churchill({
  transports: [elasticTransport]
});

const logger = createNamespace("worker:1");
logger.info("...");
```

## Options

| Option     | Description                                      | Example                                  |
| ---------- | ------------------------------------------------ | ---------------------------------------- |
| `client`   | Elasticsearch client (or just pass a `node` URL) | `new Client({ node: "..." })`            |
| `node`     | Elasticsearch node URL                           | `{ node: "http://localhost:9200" }`      |
| `index`    | Index where to store logs.                       | `churchill-log`                          |
| `format`   | Custom formatting function.                      | `{ format: (info, out, logger) => ... }` |
| `maxLevel` | Max level to log into this transport.            | `{ maxLevel: "warn" }`                   |

## Events

| Name    | Params         | Description                          |
| ------- | -------------- | ------------------------------------ |
| `error` | `error: Error` | Emited when indexing throws an Error |
