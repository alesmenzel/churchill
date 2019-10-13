// @ts-nocheck
const fs = require("fs");
const path = require("path");
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { File } = churchill.transports;
const TEMP = path.join(__dirname, "../../temp");
const FILEPATH = path.join(__dirname, "../../temp/combined.log");

// eslint-disable-next-line no-global-assign
Date = mockDate();

describe("file", () => {
  beforeEach(async () => {
    fs.rmdirSync(TEMP, { recursive: true });
    fs.mkdirSync(TEMP, { recursive: true });
  });

  afterAll(() => {
    fs.rmdirSync(TEMP, { recursive: true });
  });

  describe("options: filename", () => {
    it("logs to a file", async () => {
      const createNamespace = churchill({
        transports: [File.create({ filename: FILEPATH })]
      });
      const logger = createNamespace("{NAMESPACE}");
      await logger.warn("{LOG}", { data: "12345" });
      const data = fs.readFileSync(FILEPATH);

      expect(data.toString()).toEqual(`[${DATE}] {NAMESPACE} WARN {LOG} { data: '12345' } +0ms\n`);
    });
  });
});
