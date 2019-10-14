// @ts-nocheck
const Logger = require("./logger");
const format = require("./format");
const { DATE, TIMESTAMP } = require("../test/mocks/date.mock");

describe("format", () => {
  describe("toTerminal", () => {
    it("log message as a colorized text", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: DATE,
        ms: 235,
        args: [{ some: "data" }]
      };
      const output = "sample output";
      const logger = Logger.createLogger();
      expect(format.toTerminal(info, output, logger)).toBe(
        `\u001B[90m[${DATE}]\u001B[39m \u001B[1m[38;2;255;51;129mnamespace:a\u001B[39m\u001B[22m \u001B[1m\u001B[34mINFO\u001B[39m\u001B[22m \u001B[90m{ some: 'data' }\u001B[39m \u001B[1m[38;2;255;51;129m+235ms\u001B[39m\u001B[22m\n`
      );
    });
  });

  describe("toText", () => {
    it("log message as a text", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: DATE,
        ms: 235,
        args: [{ some: "data" }]
      };
      expect(format.toText(info)).toBe(`[${DATE}] namespace:a INFO { some: 'data' } +235ms\n`);
    });
  });

  describe("toElastic", () => {
    it("default format", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: DATE,
        ms: 235,
        args: [{ some: "data" }, "second message"]
      };
      expect(format.toElastic(info)).toEqual({
        level: info.level,
        namespace: info.namespace,
        timestamp: info.timestamp,
        message: "{ some: 'data' } 'second message'"
      });
    });

    it("default format, no args", () => {
      const info = {
        namespace: "namespace:a",
        level: "info",
        timestamp: TIMESTAMP,
        ms: 235,
        args: []
      };
      expect(format.toElastic(info)).toEqual({
        level: info.level,
        namespace: info.namespace,
        timestamp: info.timestamp,
        message: ""
      });
    });
  });
});
