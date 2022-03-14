import {Client, expect} from '@loopback/testlab';
import {MetricAggregatorServiceApplication} from '../..';
import {setupApplication} from '../test-helper';

const validState = {
  timestamp: "2022-03-13T23:27:06.736Z",
  address: "0x31e7f9b72383C5FF7D91b62c361299b473480744",
  value: 860867,
  sign: "0xe4be02b440ff00a6ed4b5427c20c1f5e46cf1453322a30bf2129637abf92d10648f5f48a22c5b97c96f511c8ed892bf6e5155b226c65a644a36d54bdd74a47181b"
}
describe('Validate Multiple Clients and Server', () => {
  let app: MetricAggregatorServiceApplication;
  let client: Client;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes Post State Create /states', async () => {
    const res = await client.post('/states').send(validState).expect(200);

    expect(res.body).to.containEql({address: validState.address, sign: validState.sign});
  });

  it('invokes GET Aggregate Metric /aggregate', async () => {
    const res = await client.get('/aggregate').expect(200);
    expect(res.body).to.containEql({avg: validState.value, count: 1});
  });

  it('invokes GET List of Reported State Data /states', async () => {
    const res = await client.get('/states').expect(200);
    expect(res.body?.length).to.equal(1);
  });
});
