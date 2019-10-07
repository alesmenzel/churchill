const Transport = require("./transport");
const Logger = require("./logger");
const config = require("./config");

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
    const logger = Logger.createLogger();
    expect(transport.format(info, output, logger)).toBe(output);
  });

  it("custom format function", () => {
    const transport = new Transport({
      format: () => "custom output"
    });
    const info = {};
    const output = "sample output";
    const logger = Logger.createLogger();
    expect(transport.format(info, output, logger)).toBe("custom output");
  });

  it("has a log function", next => {
    const transport = new Transport();
    transport.on("error", err => {
      expect(err.message).toBe(config.E_NOT_IMPLEMENTED);
      next();
    });
    const info = {};
    const output = "sample output";
    const logger = Logger.createLogger();
    transport.log(info, output, logger);
  });
});
