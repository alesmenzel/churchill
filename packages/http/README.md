# HTTP transport

Send your logged data to a http endpoint.

```bash
npm install @churchill/http
```

## Usage

```js
const churchill = require("@churchill/core");
const HTTP = require("@churchill/http");

const httpTransport = HTTP.create({
  method: "POST",
  url: "https://localhost:5000/log",
  // @ts-ignore
  cert: fs.readFileSync(certFile),
  key: fs.readFileSync(keyFile),
  ca: fs.readFileSync(caFile),
  format: info => ({ ...info, http: true })
})
httpTransport.on("error", (err) => {
  // handle potential errors
})

const createNamespace = churchill({
  transports: [
    httpTransport
  ]
});

const logger = createNamespace("worker:1");
logger.info("...");
```

## Options

| Option     | Description                                                                                                                                                  | Example                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `method`   | HTTP method                                                                                                                                                  | `{ method: "POST" }`                                  |
| `url`      | URL                                                                                                                                                          | `{ url: "https://log.example.com" }`                  |
| `auth`     | Authentication, see [auth request options](https://www.npmjs.com/package/request#requestoptions-callback)                                                    | `{ auth: { username: "john", password: "xxxxx" } }`   |
| `headers`  | HTTP headers                                                                                                                                                 | `{ headers: { "Content-Type": "application/json" } }` |
| `dataKey`  | How to send the data (e.g. body, qs, json, form, formData). This will use the request appropriate body key, which sets required headers. Defaults to `json`. | `{ dataKey: "form" }`                                 |
| `format`   | Custom formatting function.                                                                                                                                  | `{ format: (info, out, logger) => ... }`              |
| `maxLevel` | Max level to log into this transport.                                                                                                                        | `{ maxLevel: "warn" }`                                |
