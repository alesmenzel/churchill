// @ts-nocheck
const fs = require("fs");
const path = require("path");
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { File } = churchill.transports;
const TEMP = path.join(__dirname, "../../temp/");
const FILEPATH = path.join(TEMP, "combined.log");

// eslint-disable-next-line no-global-assign
Date = mockDate();

beforeAll(next => {
  fs.rmdir(TEMP, { recursive: true }, next);
});

describe("file", () => {
  beforeEach(next => {
    fs.mkdir(TEMP, { recursive: true }, next);
  });

  afterEach(next => {
    fs.rmdir(TEMP, { recursive: true }, next);
  });

  describe("options: filename", () => {
    // TODO: enable the test when jest is patched with gracefull-fs
    it("logs to a file", async () => {
      const file = File.create({ filename: FILEPATH });
      const createNamespace = churchill({
        transports: [file]
      });
      const logger = createNamespace("{NAMESPACE}");
      await logger.warn("{LOG}", { data: "12345" });
      await file.end();
      const data = fs.readFileSync(FILEPATH);

      expect(data.toString()).toEqual(`[${DATE}] {NAMESPACE} WARN {LOG} { data: '12345' } +0ms\n`);
    });
  });
});
