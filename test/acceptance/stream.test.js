// @ts-nocheck
const { PassThrough } = require("stream");
const churchill = require("../../index");
const { mockDate, DATE } = require("../mocks/date.mock");

const { Stream } = churchill.transports;

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
