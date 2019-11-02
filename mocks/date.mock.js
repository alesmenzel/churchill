const DATE = "2019-10-10T05:23:00.000Z";
const TIMESTAMP = Date.parse(DATE);

function mockDate(opts = {}) {
  const { date: mockDate = DATE, timestamp: mockTimestamp = TIMESTAMP } = opts;

  class MockDate extends Date {
    constructor(date = mockDate) {
      super(date);
    }
  }

  MockDate.now = jest.fn(() => mockTimestamp);
  MockDate.parse = Date.parse;
  MockDate.UTC = jest.fn(() => mockTimestamp);

  return MockDate;
}

module.exports = { mockDate, DATE, TIMESTAMP };
