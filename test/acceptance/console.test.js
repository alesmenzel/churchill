// @ts-nocheck
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { Console } = churchill.transports;

// eslint-disable-next-line no-global-assign
Date = mockDate();

describe("console", () => {
  describe("options: errorLevel", () => {
    xit("logs to console as stdout", async () => {
      const createNamespace = churchill({
        transports: [Console.create({ errorLevel: "error" })]
      });
      const logger = createNamespace("{NAMESPACE}");
      const spyStdout = jest.spyOn(process.stdout, "write");
      const spyStderr = jest.spyOn(process.stderr, "write");
      await logger.warn("{LOG}", { data: "12345" });

      // TODO: does not work with escape sequence
      expect(spyStdout.mock.calls).toEqual([
        [`[90m[${DATE}][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[33mWARN[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n`]
      ]);
      expect(spyStderr.mock.calls).toEqual([]);
    });

    xit("logs errors to console as stderr", async () => {
      const createNamespace = churchill({
        transports: [Console.create({ errorLevel: "warn" })]
      });
      const logger = createNamespace("{NAMESPACE}");
      const spyStdout = jest.spyOn(process.stdout, "write");
      const spyStderr = jest.spyOn(process.stderr, "write");
      await logger.warn("{LOG}", { data: "12345" });

      // TODO: does not work with escape sequence, except the first one
      expect(spyStdout.mock.calls).toEqual([]);
      expect(spyStderr.mock.calls).toEqual([
        [`\u001b[90m[${DATE}][39m [1m[38;2;54;51;255m{NAMESPACE}[39m[22m [1m[33mWARN[39m[22m [90m{LOG} { data: '12345' }[39m [1m[38;2;54;51;255m+0ms[39m[22m\n`]
      ]);
    });
  });
});
