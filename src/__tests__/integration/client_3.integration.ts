import {Client, expect} from '@loopback/testlab';
import {MetricAggregatorServiceApplication} from '../..';
import {setupApplication} from '../test-helper';

const validMetric = {
  timestamp: "2022-03-14T18:35:57.042Z",
  address: "0x531d93Be8FA2dAE13B19B102298939D15eD2E085",
  value: 252640,
  sign: "0xcf9344723025810b605d71d0ca6426147248ae010308b521965b2c722419c8474db57c74d31c91bfdf94469135166e22307a592301f6c576100e29e5347c9e9d1c"
}

describe('Validate Client 3 and Server', () => {
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
