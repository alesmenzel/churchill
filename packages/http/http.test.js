// @ts-ignore
// eslint-disable-next-line import/no-unresolved
const churchill = require("@churchill/core");
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
const { LEVELS, ERROR, WARN, INFO, VERBOSE, DEBUG, SILLY } = require("@churchill/utils");

const HTTP = require("./http");
const createHttpServer = require("./test/http-server");
const { mockDate, TIMESTAMP } = require("../../mocks/date.mock");

function handleRequests(http, next) {
  http.on("request", (req, res) => {
    const body = [];
    req.on("data", chunk => {
      body.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(body).toString();
      req.body = JSON.parse(data);
      next(req, res);
    });
  });
}

function sendOK(req, res) {
  res.writeHead(200);
  res.end("OK");
}

// @ts-ignore
// eslint-disable-next-line no-global-assign
Date = mockDate();

describe("HTTP", () => {
  let http;
  beforeAll(next => {
    http = createHttpServer(5000, next);
  });

  afterEach(() => {
    http.removeAllListeners("request");
  });

  afterAll(next => {
    http.close(next);
  });

  describe("defaults", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log"
          })
        ]
      });
      logger = createNamespace("{NAMESPACE}");
    });

    [ERROR, WARN, INFO].forEach(LEVEL => {
      it(`logs ${LEVEL} message`, async () => {
        const handler = jest.fn(sendOK);
        handleRequests(http, handler);
        await logger[LEVEL]("{LOG}", { data: "12345" });

        const CALLS = handler.mock.calls.map(([req]) => ({
          method: req.method,
          url: req.url,
          body: req.body
        }));
        const EXPECTATION = [
          {
            method: "POST",
            url: "/log",
            body: {
              level: LEVEL,
              args: ["{LOG}", { data: "12345" }],
              ms: 0,
              namespace: "{NAMESPACE}",
              priority: LEVELS[LEVEL],
              timestamp: TIMESTAMP
            }
          }
        ];
        expect(CALLS).toEqual(EXPECTATION);
      });
    });

    [VERBOSE, DEBUG, SILLY].forEach(LEVEL => {
      it(`does NOT log ${LEVEL} message`, async () => {
        const handler = jest.fn(sendOK);
        handleRequests(http, handler);
        await logger[LEVEL]("{LOG}", { data: "12345" });

        const CALLS = handler.mock.calls.map(([req]) => ({
          method: req.method,
          url: req.url,
          body: req.body
        }));
        const EXPECTATION = [];
        expect(CALLS).toEqual(EXPECTATION);
      });
    });
  });

  describe("maxLevel - global", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log"
          })
        ],
        maxLevel: WARN
      });
      logger = createNamespace("{NAMESPACE}");
    });

    [ERROR, WARN].forEach(LEVEL => {
      it(`logs ${LEVEL} message`, async () => {
        const handler = jest.fn(sendOK);
        handleRequests(http, handler);
        await logger[LEVEL]("{LOG}", { data: "12345" });

        const CALLS = handler.mock.calls.map(([req]) => ({
          method: req.method,
          url: req.url,
          body: req.body
        }));
        const EXPECTATION = [
          {
            method: "POST",
            url: "/log",
            body: {
              level: LEVEL,
              args: ["{LOG}", { data: "12345" }],
              ms: 0,
              namespace: "{NAMESPACE}",
              priority: LEVELS[LEVEL],
              timestamp: TIMESTAMP
            }
          }
        ];
        expect(CALLS).toEqual(EXPECTATION);
      });
    });

    [INFO, VERBOSE, DEBUG, SILLY].forEach(LEVEL => {
      it(`does NOT log ${LEVEL} message`, async () => {
        const handler = jest.fn(sendOK);
        handleRequests(http, handler);
        await logger[LEVEL]("{LOG}", { data: "12345" });

        const CALLS = handler.mock.calls.map(([req]) => ({
          method: req.method,
          url: req.url,
          body: req.body
        }));
        const EXPECTATION = [];
        expect(CALLS).toEqual(EXPECTATION);
      });
    });
  });

  describe("option: transport.maxLevel", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log1",
            maxLevel: ERROR
          }),
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log2",
            maxLevel: WARN
          })
        ]
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message in both transports", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls
        .map(([req]) => ({
          method: req.method,
          url: req.url,
          body: req.body
        }))
        // The events are dispatched concurrently and can arrive in any order
        .sort((a, b) => a.url.localeCompare(b.url));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log1",
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        },
        {
          method: "POST",
          url: "/log2",
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });

    it("logs warn message in one transport and not the other one", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.warn("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log2",
          body: {
            level: WARN,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[WARN],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });

    it("does NOT log to any transport", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.info("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });

  describe("option: maxLevel > transport.maxLevel", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log",
            maxLevel: ERROR
          })
        ],
        maxLevel: WARN
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log",
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });

    it("does NOT log warn message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.warn("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });

  describe("option: maxLevel == transport.maxLevel", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log",
            maxLevel: ERROR
          })
        ],
        maxLevel: ERROR
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log",
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });

    it("does NOT log warn message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.warn("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });

  describe("option: maxLevel < transport.maxLevel", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log",
            maxLevel: WARN
          })
        ],
        maxLevel: ERROR
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log",
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });

    it("does NOT log warn message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.warn("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body
      }));
      const EXPECTATION = [];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });

  describe("option: transport.<any> (request options)", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log",
            auth: {
              username: "user",
              password: "pass"
            },
            headers: {
              "X-My-Header": "{HEADER}",
              "Content-Type": "application/json"
            },
            format: info => JSON.stringify(info),
            dataKey: "body"
          })
        ]
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log",
          headers: {
            authorization: "Basic dXNlcjpwYXNz",
            "x-my-header": "{HEADER}",
            "content-type": "application/json",
            connection: "close",
            "content-length": "123",
            host: "localhost:5000"
          },
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });

  describe("option: transport.format", () => {
    let logger;
    beforeEach(() => {
      const createNamespace = churchill({
        transports: [
          HTTP.create({
            method: "POST",
            url: "http://localhost:5000/log",
            auth: {
              username: "user",
              password: "pass"
            },
            headers: {
              "X-My-Header": "{HEADER}",
              "Content-Type": "application/json"
            },
            format: info => JSON.stringify({ ...info, formatted: true }),
            dataKey: "body"
          })
        ]
      });
      logger = createNamespace("{NAMESPACE}");
    });

    it("logs error message", async () => {
      const handler = jest.fn(sendOK);
      handleRequests(http, handler);
      await logger.error("{LOG}", { data: "12345" });

      const CALLS = handler.mock.calls.map(([req]) => ({
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
      }));
      const EXPECTATION = [
        {
          method: "POST",
          url: "/log",
          headers: {
            authorization: "Basic dXNlcjpwYXNz",
            "x-my-header": "{HEADER}",
            "content-type": "application/json",
            connection: "close",
            "content-length": "140",
            host: "localhost:5000"
          },
          body: {
            level: ERROR,
            args: ["{LOG}", { data: "12345" }],
            ms: 0,
            namespace: "{NAMESPACE}",
            priority: LEVELS[ERROR],
            timestamp: TIMESTAMP,
            formatted: true
          }
        }
      ];
      expect(CALLS).toEqual(EXPECTATION);
    });
  });
});
