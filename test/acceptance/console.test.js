// @ts-nocheck
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { Console } = churchill.transports;

// eslint-disable-next-line no-global-assign
Date = mockDate();

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
        [
          `\u001B[90m[${DATE}]\u001B[39m \u001B[1m[38;2;54;51;255m{NAMESPACE}\u001B[39m\u001B[22m \u001B[1m\u001B[33mWARN\u001B[39m\u001B[22m \u001B[90m{LOG} { data: '12345' }\u001B[39m \u001B[1m[38;2;54;51;255m+0ms\u001B[39m\u001B[22m\n`
        ]
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
        [
          `\u001B[90m[${DATE}]\u001B[39m \u001B[1m[38;2;54;51;255m{NAMESPACE}\u001B[39m\u001B[22m \u001B[1m\u001B[33mWARN\u001B[39m\u001B[22m \u001B[90m{LOG} { data: '12345' }\u001B[39m \u001B[1m[38;2;54;51;255m+0ms\u001B[39m\u001B[22m\n`
        ]
      ]);
    });
  });
});
