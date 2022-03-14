import {Client, expect} from '@loopback/testlab';
import {MetricAggregatorServiceApplication} from '../..';
import {setupApplication} from '../test-helper';

const validMetric = {
  timestamp: "2022-03-14T18:34:42.596Z",
  address: "0xc7cA31A8398dc5247FCe496B26B61a5eA4Ee2366",
  value: 280533,
  sign: "0x4658e3010c8e78c7675724280d7097ab31cf870b1f54af581fe5e7de507c5b7f2b9aa028b2f709b864b15704a091b295677f4b62cbc334349b13e658bce16d071c"
}

describe('Validate Client 2 and Server', () => {
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
