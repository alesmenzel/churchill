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

  it("LEVELS are exported", () => {
    expect(typeof churchill.LEVELS).toBe("object");
  });

  it("COLORS are exported", () => {
    expect(typeof churchill.COLORS).toBe("object");
  });

  test.each(["ERROR", "WARN", "INFO", "VERBOSE", "DEBUG", "SILLY"])(
    `Default level '%s' is exported`,
    LEVEL => {
      expect(typeof churchill[LEVEL]).toBe("string");
    }
  );
});
