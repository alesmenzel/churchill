// @ts-nocheck
const churchill = require("../../index");

const { Console } = churchill.transports;

Date.now = jest.fn(() => 1570741517603);

describe("console", () => {
  it("logs info to console as stdout", () => {
    const createNamespace = churchill({
      transports: [Console.create({ maxLevel: "verbose", errorLevel: "error" })]
    });
    const logger = createNamespace("{NAMESPACE}");

    const spy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);

    logger.verbose("{LOG}", { data: "12345" });
    expect(spy.mock.calls).toEqual([
      ["[90m[2019-10-10T21:05:17.603Z][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[36mVERBOSE[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n"]
    ]);
  });

  it("logs errors to console as stderr", () => {
    const createNamespace = churchill({
      transports: [Console.create({ maxLevel: "info", errorLevel: "warn" })]
    });
    const logger = createNamespace("{NAMESPACE}");

    const spy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);

    logger.warn("{LOG}", { data: "12345" });
    expect(spy.mock.calls).toEqual([
      ["[90m[2019-10-10T21:05:17.603Z][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[33mWARN[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n"]
    ]);
  });
});
