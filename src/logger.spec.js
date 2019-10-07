const Logger = require("./logger");
const Transport = require("./transport");
const { Console } = require("./transports");

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
    Date.now = jest.fn(() => 1570394838496);

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
      timestamp: 1570394838496,
      priority: 1,
      ms: 0,
      args: [{ some: "data" }]
    };

    const info2 = {
      level: "lvl2",
      namespace: "namespace",
      timestamp: 1570394838496,
      priority: 2,
      ms: 0,
      args: ["some message"]
    };

    const info3 = {
      level: "lvl3",
      namespace: "namespace",
      timestamp: 1570394838496,
      priority: 3,
      ms: 0,
      args: ["msg", new Error("ERR")]
    };

    // @ts-ignore
    expect(mockTransport.log.mock.calls).toEqual([
      [info1, info1, logger],
      [info2, info2, logger],
      [info3, info3, logger]
    ]);
    // @ts-ignore
    expect(mockTransport2.log.mock.calls).toEqual([
      [info1, info1, logger],
      [info2, info2, logger],
      [info3, info3, logger]
    ]);
  });
});
