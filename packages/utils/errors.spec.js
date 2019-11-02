const { ChurchillError } = require("./errors");

describe("errors", () => {
  describe("LogError", () => {
    it("return new log error", () => {
      const err = new ChurchillError("message", { some: "data" });
      expect(err.message).toBe("message");
      expect(err.data).toEqual({ some: "data" });
    });
  });
});
