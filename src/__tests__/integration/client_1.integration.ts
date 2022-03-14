import {Client, expect} from '@loopback/testlab';
import {MetricAggregatorServiceApplication} from '../..';
import {setupApplication} from '../test-helper';

const validMetric = {
  timestamp: "2022-03-13T23:27:06.736Z",
  address: "0x31e7f9b72383C5FF7D91b62c361299b473480744",
  value: 860867,
  sign: "0xe4be02b440ff00a6ed4b5427c20c1f5e46cf1453322a30bf2129637abf92d10648f5f48a22c5b97c96f511c8ed892bf6e5155b226c65a644a36d54bdd74a47181b"
}

describe('Validate Client 1 and Server', () => {
  let app: MetricAggregatorServiceApplication;
  let client: Client;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes Post Metric Create /metrics', async () => {
    const res = await client.post('/metrics').send(validMetric).expect(200);

    expect(res.body).to.containEql({address: validMetric.address, sign: validMetric.sign});
  });

  it('invokes GET Aggregate Metric /aggregate', async () => {
    const res = await client.get('/aggregate').expect(200);
    expect(res.body).to.containEql({avg: validMetric.value, count: 1});
  });

  it('invokes GET List of Reported Metric Data /metrics', async () => {
    const res = await client.get('/metrics').expect(200);
    expect(res.body?.length).to.equal(1);
  });
});
