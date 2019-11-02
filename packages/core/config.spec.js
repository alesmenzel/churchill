/* eslint-disable global-require */
const OLD_ENV = process.env;

describe("config", () => {
  beforeEach(() => {
    jest.resetModules(); // reset module cache
    process.env = { ...OLD_ENV };
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
