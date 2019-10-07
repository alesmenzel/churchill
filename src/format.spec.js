const Logger = require("./logger");
const format = require("./format");

describe("format", () => {
  describe("toTerminal", () => {
    it("log message as a colorized text", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: 1570391958723,
        ms: 235,
        args: [{ some: "data" }]
      };
      const output = "sample output";
      const logger = Logger.createLogger();
      expect(format.toTerminal(info, output, logger)).toBe(
        "[90m[2019-10-06T19:59:18.723Z][39m [1m[38;2;255;51;129mnamespace:a[39m[22m [1m[34mINFO[39m[22m [90m{ some: 'data' }[39m [1m[38;2;255;51;129m+235ms[39m[22m\n"
      );
    });
  });

  describe("toText", () => {
    it("log message as a text", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: 1570391958723,
        ms: 235,
        args: [{ some: "data" }]
      };
      expect(format.toText(info)).toBe(
        "[2019-10-06T19:59:18.723Z] namespace:a INFO { some: 'data' } +235ms\n"
      );
    });
  });
});
