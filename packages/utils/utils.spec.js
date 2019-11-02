/* eslint-disable global-require */
const {
  identity,
  isset,
  md5,
  HSVtoRGB,
  randomStableColor,
  isNamespaceEnabled,
  stringify
} = require("./utils");

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
  it("return true when enabled", () => {
    const CHURCHILL_DEBUG = "namespace:a*,namespace:b";
    // @ts-ignore
    const CHURCHILL_DEBUG_NAMESPACES = [/^namespace:a.*?$/, /^namespace:b$/];
    expect(isNamespaceEnabled("namespace:a", CHURCHILL_DEBUG, CHURCHILL_DEBUG_NAMESPACES)).toBe(
      true
    );
  });

  it("return false when not enabled", () => {
    const CHURCHILL_DEBUG = "namespace:a*,namespace:b";
    // @ts-ignore
    const CHURCHILL_DEBUG_NAMESPACES = [/^namespace:a.*?$/, /^namespace:b$/];
    expect(isNamespaceEnabled("namespace:b:one", CHURCHILL_DEBUG, CHURCHILL_DEBUG_NAMESPACES)).toBe(
      false
    );
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

describe("stringify", () => {
  it("multiple items", () => {
    expect(stringify(["sample", { a: "b" }])).toBe("sample { a: 'b' }");
  });

  it("empty", () => {
    expect(stringify([])).toBe("");
  });
});
