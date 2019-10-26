/* eslint-disable global-require */
const OLD_ENV = process.env;

describe("config", () => {
  beforeEach(() => {
    jest.resetModules(); // reset module cache
    process.env = { ...OLD_ENV };
  });

  [
    ["ERROR", "error"],
    ["WARN", "warn"],
    ["INFO", "info"],
    ["VERBOSE", "verbose"],
    ["DEBUG", "debug"],
    ["SILLY", "silly"]
  ].forEach(([LEVEL, level]) => {
    it(`Level '${LEVEL}' is exported`, () => {
      const config = require("./config");
      expect(config[LEVEL]).toBe(level);
    });
  });

  it(`Levels are exported`, () => {
    const config = require("./config");
    expect(config.LEVELS).toEqual({
      [config.ERROR]: 0,
      [config.WARN]: 1,
      [config.INFO]: 2,
      [config.VERBOSE]: 3,
      [config.DEBUG]: 4,
      [config.SILLY]: 5
    });
  });

  it(`Colors are exported`, () => {
    const config = require("./config");
    expect(config.COLORS).toEqual({
      [config.ERROR]: "red",
      [config.WARN]: "yellow",
      [config.INFO]: "blue",
      [config.VERBOSE]: "cyan",
      [config.DEBUG]: "green",
      [config.SILLY]: "white"
    });
  });

  it("CHURCHILL_DEBUG", () => {
    process.env.CHURCHILL_DEBUG = "namespace:a:*,namespace:b";
    const config = require("./config");
    expect(config.CHURCHILL_DEBUG).toEqual("namespace:a:*,namespace:b");
  });

  describe("CHURCHILL_DEBUG_NAMESPACES", () => {
    it("multiple namespaces", () => {
      process.env.CHURCHILL_DEBUG = "namespace:a*,namespace:b";
      const config = require("./config");
      expect(config.CHURCHILL_DEBUG_NAMESPACES).toEqual([/^namespace:a.*?$/, /^namespace:b$/]);
    });

    it("single namespaces", () => {
      process.env.CHURCHILL_DEBUG = "namespace:a*";
      const config = require("./config");
      expect(config.CHURCHILL_DEBUG_NAMESPACES).toEqual([/^namespace:a.*?$/]);
    });

    it("empty", () => {
      process.env.CHURCHILL_DEBUG = undefined;
      const config = require("./config");
      expect(config.CHURCHILL_DEBUG_NAMESPACES).toBeNull();
    });
  });

  it("CHURCHILL_DEBUG_LEVEL", () => {
    process.env.CHURCHILL_DEBUG_LEVEL = "info";
    const config = require("./config");
    expect(config.CHURCHILL_DEBUG_LEVEL).toBe("info");
  });
});
