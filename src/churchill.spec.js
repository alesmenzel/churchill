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
});
