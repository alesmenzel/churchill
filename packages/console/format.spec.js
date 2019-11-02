// eslint-disable-next-line import/no-extraneous-dependencies
const { createLogger } = require("@churchill/core");
const toTerminal = require("./format");

jest.mock("supports-color");

const TIMESTAMP = Date.now();
const DATE = new Date(TIMESTAMP).toISOString();

describe("toTerminal", () => {
  it("log message as a colorized text", () => {
    const info = {
      namespace: "namespace:a",
      level: "info",
      timestamp: TIMESTAMP,
      ms: 235,
      args: [{ some: "data" }]
    };
    const output = "sample output";
    const logger = createLogger();
    expect(toTerminal(info, output, logger)).toBe(
      `[90m[${DATE}][39m [1m[38;2;255;51;129mnamespace:a[39m[22m [1m[34mINFO[39m[22m [90m{ some: 'data' }[39m [1m[38;2;255;51;129m+235ms[39m[22m\n`
    );
  });
});
