const toElastic = require("./format");

const TIMESTAMP = Date.now();

describe("toElastic", () => {
  it("default format", () => {
    const info = {
      namespace: "namespace:a",
      level: "info",
      timestamp: TIMESTAMP,
      ms: 235,
      args: [{ some: "data" }, "second message"]
    };
    expect(toElastic(info)).toEqual({
      level: info.level,
      namespace: info.namespace,
      timestamp: info.timestamp,
      message: "{ some: 'data' } second message"
    });
  });

  it("default format, no args", () => {
    const info = {
      namespace: "namespace:a",
      level: "info",
      timestamp: TIMESTAMP,
      ms: 235,
      args: []
    };
    expect(toElastic(info)).toEqual({
      level: info.level,
      namespace: info.namespace,
      timestamp: info.timestamp,
      message: ""
    });
  });
});
