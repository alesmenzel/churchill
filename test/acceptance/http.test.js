// @ts-nocheck
const churchill = require("../../index");
const createHttpServer = require("../servers/http-server");

const { HTTP } = churchill.transports;

function handleRequest(next) {
  return (req, res) => {
    const body = [];
    req.on("data", chunk => {
      body.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(body).toString();
      req.body = JSON.parse(data);
      next(req, res);
    });
  };
}

function sendOK(res) {
  res.writeHead(200);
  res.end("OK");
}

Date.now = jest.fn(() => 1570741517603);

describe("HTTP", () => {
  let http;
  beforeAll(next => {
    http = createHttpServer(5000, next);
  });

  afterAll(next => {
    http.close(next);
  });

  afterEach(() => {
    http.removeAllListeners("request");
  });

  it("logs json to http server", next => {
    const createNamespace = churchill({
      transports: [
        HTTP.create({
          method: "POST",
          url: "http://localhost:5000/log"
        })
      ]
    });
    const logger = createNamespace("{NAMESPACE}");
    http.on(
      "request",
      handleRequest((req, res) => {
        expect(req.method).toBe("POST");
        expect(req.url).toBe("/log");
        expect(req.body).toEqual({
          level: "info",
          args: ["{LOG}", { data: "12345" }],
          ms: 0,
          namespace: "{NAMESPACE}",
          priority: 2,
          timestamp: 1570741517603
        });
        sendOK(res);
        next();
      })
    );

    logger.info("{LOG}", { data: "12345" });
  });
});
