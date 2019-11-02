const Console = require("@churchill/console");
// eslint-disable-next-line import/no-extraneous-dependencies
const Transport = require("@churchill/transport");

const Logger = require("./logger");
const { mockDate, TIMESTAMP } = require("../../mocks/date.mock");

// @ts-ignore
// eslint-disable-next-line no-global-assign
Date = mockDate();

describe("logger", () => {
  it("create new Logger", () => {
    const logger = new Logger();
    expect(logger instanceof Logger).toBe(true);
  });

  it("create new Logger with options", () => {
    const logger = new Logger({
      levels: {
        lvl1: 1,
        lvl2: 2,
        lvl3: 3
      },
      colors: {
        lvl1: "red",
        lvl2: "yellow",
        lvl3: "green"
      },
      namespace: "namespace",
      maxLevel: "lvl2",
      transports: [Console.create()],
      format: info => info
    });
    expect(logger instanceof Logger).toBe(true);
  });

  it("create new Logger factory", () => {
    const logger = Logger.createLogger();
    expect(logger instanceof Logger).toBe(true);
  });

  it("create new Logger factory with options", () => {
    const logger = Logger.createLogger({
      levels: {
        lvl1: 1,
        lvl2: 2,
        lvl3: 3
      },
      colors: {
        lvl1: "red",
        lvl2: "yellow",
        lvl3: "green"
      },
      namespace: "namespace",
      maxLevel: "lvl2",
      transports: [Console.create()],
      format: info => info
    });
    expect(logger instanceof Logger).toBe(true);
  });

  it("log messages with custom levels", () => {
    const mockTransport = new Transport();
    mockTransport.log = jest.fn();

    const mockTransport2 = new Transport();
    mockTransport2.log = jest.fn();

    const logger = Logger.createLogger({
      levels: {
        lvl1: 1,
        lvl2: 2,
        lvl3: 3
      },
      colors: {
        lvl1: "red",
        lvl2: "yellow",
        lvl3: "green"
      },
      namespace: "namespace",
      maxLevel: "lvl2",
      transports: [mockTransport, mockTransport2],
      format: info => info
    });

    // @ts-ignore
    logger.lvl1({ some: "data" });
    // @ts-ignore
    logger.lvl2("some message");
    // @ts-ignore
    logger.lvl3("msg", new Error("ERR"));

    const info1 = {
      level: "lvl1",
      namespace: "namespace",
      timestamp: TIMESTAMP,
      priority: 1,
      ms: 0,
      args: [{ some: "data" }]
    };

    const info2 = {
      level: "lvl2",
      namespace: "namespace",
      timestamp: TIMESTAMP,
      priority: 2,
      ms: 0,
      args: ["some message"]
    };

    // @ts-ignore
    expect(mockTransport.log.mock.calls).toEqual([[info1, info1, logger], [info2, info2, logger]]);
    // @ts-ignore
    expect(mockTransport2.log.mock.calls).toEqual([[info1, info1, logger], [info2, info2, logger]]);
  });
});
