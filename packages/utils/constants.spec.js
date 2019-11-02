const constants = require("./constants");

describe("constants", () => {
  test.each([
    ["ERROR", "error"],
    ["WARN", "warn"],
    ["INFO", "info"],
    ["VERBOSE", "verbose"],
    ["DEBUG", "debug"],
    ["SILLY", "silly"]
  ])("Level '%s' is exported", (LEVEL, level) => {
    expect(constants[LEVEL]).toBe(level);
  });

  it(`Levels are exported`, () => {
    expect(constants.LEVELS).toEqual({
      [constants.ERROR]: 0,
      [constants.WARN]: 1,
      [constants.INFO]: 2,
      [constants.VERBOSE]: 3,
      [constants.DEBUG]: 4,
      [constants.SILLY]: 5
    });
  });

  it(`Colors are exported`, () => {
    expect(constants.COLORS).toEqual({
      [constants.ERROR]: "red",
      [constants.WARN]: "yellow",
      [constants.INFO]: "blue",
      [constants.VERBOSE]: "cyan",
      [constants.DEBUG]: "green",
      [constants.SILLY]: "white"
    });
  });
});
