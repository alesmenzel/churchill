const config = require("./config");

describe("config", () => {
  xit("DEBUG_NAMESPACES", () => {
    // TODO: figure out how to mock env. variables
    // config.DEBUG = "namespace:a:*,namespace:b";
    expect(config.DEBUG_NAMESPACES).toEqual([/^namespace:a.*?$/, /^namespace:b$/]);
  });
});
