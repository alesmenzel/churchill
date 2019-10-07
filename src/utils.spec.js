const {
  identity,
  isset,
  isNamespaceEnabled,
  md5,
  HSVtoRGB,
  randomStableColor
} = require("./utils");
const config = require("./config");

jest.mock("./config", () => ({}));

describe("identity", () => {
  it("return the same value", () => {
    const value = { a: 4 };
    expect(identity(value)).toBe(value);
  });
});

describe("isset", () => {
  it("return true if any value is set", () => {
    expect(isset({})).toBe(true);
    expect(isset({ a: 4 })).toBe(true);
    expect(isset([])).toBe(true);
    expect(isset(["item 1"])).toBe(true);
    expect(isset("some string")).toBe(true);
    expect(isset("")).toBe(true);
    expect(isset(0)).toBe(true);
    expect(isset(125)).toBe(true);
  });

  it("return false if no value is set", () => {
    expect(isset(undefined)).toBe(false);
  });
});

describe("isNamespaceEnabled", () => {
  afterEach(() => {
    // TODO: this does not seem to restore the module mock
    jest.restoreAllMocks();
  });

  xit("return true when enabled", () => {
    // TODO: figure out a way to mock the config module
    config.DEBUG = "namespace:a*,namespace:b";
    config.DEBUG_NAMESPACES = [/^namespace:a.*?$/, /^namespace:b$/];
    expect(isNamespaceEnabled("namespace:a")).toBe(true);
  });

  xit("return false when not enabled", () => {
    // TODO: figure out a way to mock the config module
    config.DEBUG = "namespace:a*,namespace:b";
    config.DEBUG_NAMESPACES = [/^namespace:a.*?$/, /^namespace:b$/];
    expect(isNamespaceEnabled("namespace:b:one")).toBe(false);
  });
});

describe("md5", () => {
  it("return md5 hash in hex", () => {
    expect(md5("sample string")).toBe("bcc7bec3c06016aa979fe07fceb0396a");
  });
});

describe("HSVtoRGB", () => {
  it("convert HSV to RGB", () => {
    expect(HSVtoRGB(173, 0.63, 0.17)).toEqual({ r: 16, g: 43, b: 40 });
  });
});

describe("randomStableColor", () => {
  it("return same color", () => {
    expect(randomStableColor("sample")).toEqual({ r: 255, g: 248, b: 51 });
    expect(randomStableColor("sample")).toEqual({ r: 255, g: 248, b: 51 });
  });
});
