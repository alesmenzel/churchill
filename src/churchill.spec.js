const churchill = require("./churchill");

describe("churchill", () => {
  it("module exports a function", () => {
    expect(typeof churchill).toBe("function");
  });

  it("Logger is exported", () => {
    expect(typeof churchill.Logger).toBe("function");
  });

  it("createLogger is exported", () => {
    expect(typeof churchill.createLogger).toBe("function");
  });

  it("format is exported", () => {
    expect(typeof churchill.format).toBe("object");
  });

  it("transports is exported", () => {
    expect(typeof churchill.transports).toBe("object");
  });

  it("Transport is exported", () => {
    expect(typeof churchill.Transport).toBe("function");
  });

  it("LEVELS are exported", () => {
    expect(typeof churchill.LEVELS).toBe("object");
  });

  it("COLORS are exported", () => {
    expect(typeof churchill.COLORS).toBe("object");
  });

  ["ERROR", "WARN", "INFO", "VERBOSE", "DEBUG", "SILLY"].forEach(LEVEL => {
    it(`Default level '${LEVEL}' is exported`, () => {
      expect(typeof churchill[LEVEL]).toBe("string");
    });
  });
});
