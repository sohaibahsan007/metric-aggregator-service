import {juggler} from '@loopback/repository';
import {
  Client, createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {MetricAggregatorServiceApplication} from '..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new MetricAggregatorServiceApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: MetricAggregatorServiceApplication;
  client: Client;
}

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'db',
  connector: 'memory',
});
