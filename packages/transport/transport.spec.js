// eslint-disable-next-line import/no-extraneous-dependencies
const { createLogger } = require("@churchill/core");
const Transport = require("./transport");

describe("Transport", () => {
  it("return max level", () => {
    const transport = new Transport({
      maxLevel: "verbose"
    });
    expect(transport.getMaxLevel()).toBe("verbose");
  });

  it("return max level even if not set", () => {
    const transport = new Transport();
    expect(transport.getMaxLevel()).toBeUndefined();
  });

  it("format function", () => {
    const transport = new Transport();
    const info = {};
    const output = "sample output";
    const logger = createLogger();
    expect(transport.format(info, output, logger)).toBe(output);
  });

  it("custom format function", () => {
    const transport = new Transport({
      format: () => "custom output"
    });
    const info = {};
    const output = "sample output";
    const logger = createLogger();
    expect(transport.format(info, output, logger)).toBe("custom output");
  });

  it("has a log function", next => {
    const transport = new Transport();
    transport.on("error", err => {
      expect(err.message).toBe("log(info, output, logger) must be implemented by the child class");
      next();
    });
    const info = {};
    const output = "sample output";
    const logger = createLogger();
    transport.log(info, output, logger);
  });
});
