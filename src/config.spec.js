const config = require("./config");

describe("config", () => {
  xit("CHURCHILL_DEBUG_NAMESPACES", () => {
    // TODO: figure out how to mock env. variables
    // config.DEBUG = "namespace:a:*,namespace:b";
    expect(config.CHURCHILL_DEBUG_NAMESPACES).toEqual([/^namespace:a.*?$/, /^namespace:b$/]);
  });
});
