// eslint-disable-next-line import/no-extraneous-dependencies
const churchill = require("@churchill/core");
const { PassThrough } = require("stream");

const Stream = require("./stream");
const { mockDate, DATE } = require("../../mocks/date.mock");

// @ts-ignore
// eslint-disable-next-line no-global-assign
Date = mockDate();

describe("stream", () => {
  it("logs to a stream", async () => {
    const stream = new PassThrough();
    const createNamespace = churchill({
      transports: [Stream.create({ stream })]
    });
    const logger = createNamespace("{NAMESPACE}");
    const spyWrite = jest.spyOn(stream, "write");
    await logger.warn("{LOG}", { data: "12345" });

    expect(spyWrite.mock.calls).toEqual([
      [`[${DATE}] {NAMESPACE} WARN {LOG} { data: '12345' } +0ms\n`]
    ]);
  });
});
