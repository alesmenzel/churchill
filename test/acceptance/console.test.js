// @ts-nocheck
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { Console } = churchill.transports;

// eslint-disable-next-line no-global-assign
Date = mockDate();

// mock that the terminal supports colors
jest.mock("supports-color");

describe("console", () => {
  describe("options: errorLevel", () => {
    it("logs to console as stdout", async () => {
      const createNamespace = churchill({
        transports: [Console.create({ errorLevel: "error" })]
      });
      const logger = createNamespace("{NAMESPACE}");
      const spyStdout = jest.spyOn(process.stdout, "write");
      const spyStderr = jest.spyOn(process.stderr, "write");
      await logger.warn("{LOG}", { data: "12345" });

      expect(spyStdout.mock.calls).toEqual([
        [`[90m[${DATE}][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[33mWARN[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n`]
      ]);
      expect(spyStderr.mock.calls).toEqual([]);
    });

    it("logs errors to console as stderr", async () => {
      const createNamespace = churchill({
        transports: [Console.create({ errorLevel: "warn" })]
      });
      const logger = createNamespace("{NAMESPACE}");
      const spyStdout = jest.spyOn(process.stdout, "write");
      const spyStderr = jest.spyOn(process.stderr, "write");
      await logger.warn("{LOG}", { data: "12345" });

      expect(spyStdout.mock.calls).toEqual([]);
      expect(spyStderr.mock.calls).toEqual([
        [`[90m[${DATE}][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[33mWARN[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n`]
      ]);
    });
  });
});
