const toText = require("./format");

const TIMESTAMP = Date.now();
const DATE = new Date(TIMESTAMP).toISOString();

describe("toText", () => {
  it("log message as a text", () => {
    const info = {
      namespace: "namespace:a",
      level: "info",
      timestamp: TIMESTAMP,
      ms: 235,
      args: [{ some: "data" }]
    };
    expect(toText(info)).toBe(`[${DATE}] namespace:a INFO { some: 'data' } +235ms\n`);
  });
});
