// @ts-nocheck
const { Client } = require("@elastic/elasticsearch");
const churchill = require("../../index");
const { mockDate, TIMESTAMP } = require("../mocks/date.mock");

const { Elastic } = churchill.transports;

const NODE = "http://localhost:9200";
const INDEX = "churchill-logs";

// eslint-disable-next-line no-global-assign
Date = mockDate();

const client = new Client({ node: NODE });

describe("elastic", () => {
  beforeAll(async () => {
    await client.indices.delete({
      index: INDEX,
      ignore_unavailable: true
    });
  });

  beforeEach(async () => {
    await client.indices.create({
      index: INDEX
    });
  });

  afterEach(async () => {
    await client.indices.delete({
      index: INDEX,
      ignore_unavailable: true
    });
  });

  it("logs error message", async () => {
    const createNamespace = churchill({
      transports: [Elastic.create({ node: NODE, index: INDEX })]
    });
    const logger = createNamespace("{NAMESPACE}");
    await logger.error("{LOG}", { data: "12345" });
    await logger.info("{LOG}", { data: "12345" });

    await client.indices.refresh({ index: INDEX });
    const res = await client.search({
      index: INDEX,
      body: {}
    });

    const { hits } = res.body;
    expect(hits.total.value).toBe(2);
    const logs = hits.hits
      .map(({ _source: source }) => source)
      .sort((a, b) => a.level.localeCompare(b.level));
    expect(logs).toEqual([
      {
        level: "error",
        message: "'{LOG}'",
        namespace: "{NAMESPACE}",
        timestamp: TIMESTAMP
      },
      {
        level: "info",
        message: "'{LOG}'",
        namespace: "{NAMESPACE}",
        timestamp: TIMESTAMP
      }
    ]);
  });
});
