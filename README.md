# metric-aggregator-service

this application contains service which ingest metric data, make available over api and a client which broadcast random number in a range to the collector. 

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

and for the UI

```sh
cd ui/ && npm i
```

## Set Config for API

config file in API contains only one var which is staleTime and has a default value of 10sec. if you want to change the default staleTime, Open [config.ts](https://github.com/sohaibahsan007/metric-aggregator-service/blob/48dc593be09ed19e67f4c8006f311a0d2fd56d58/src/config.ts#L2) and change staleTime to anything you want. 

```sh 
export const config = {
  staleTime: '10', // seconds
};
```

## Run the API

```sh
npm run start
```

You can also run `node .` to skip the build step.

Open http://localhost:3000/ in your browser.

you can see swagger compatible API Explore on http://localhost:3000/explorer/ and Open API Spec.json http://localhost:3000/openapi.json which can be used to Import as collection in Postman. 

## Set Config for UI

config file in UI, which can be accessed using this link [config.json](https://github.com/sohaibahsan007/metric-aggregator-service/blob/00b8c926539f19653c59d88a29b712a91b27990d/ui/config.json#L1) which contains following variables. 

```sh
[{
  "serverURL": "http://localhost:3000/metrics",
  "publishIntervalInSec": "5",
  "privateKey": "585b2e8bc0836315c36445f07cadb6b509a0d721c518c3ebdf7d5372c8bc23d7"
}]
```

you can change privateKey to your own privateKey. 


## Run the UI

```sh
cd ui/ && npm run serve
```
If you are already in **UI** directoy then run. 

```sh
npm run serve
``` 

Open http://localhost:9011/ in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```


# Project structure

```
dist/                             compiled version
src/                              api project source code
|- __tests__/                     contains tests 
|  |- acceptance                  contains basic acceptance test
|  |- integration                 contains multiple clients and server integration test
|  |- unit                        contains unit test for aggregation testing, stale data timeout and signature validation.
|  +- test-helper.ts              tests basic helper file
|- auth/                          contains signature validation code
|  |- auth_strategy.enum.ts       contains type of auth strategy
|  |- sign_verify.service.ts      contains signature validation service 
|  |- sign_verify_strategy.ts     contains implementation of auth with signature verfication when ever auth decorator is used. 
|- controllers                    contains 3 controllers including getting aggregate mertric, list of metric records and post method to create metric record.
|- datasources                    contains in-memory db datasource
|- logger                         contains logger library 
|- models                         contains all models
|  |- aggregate.model.ts          this model contains aggregate properties (average and count).
|  |- base.entity.ts              this model contains basic property that can be shared and re-used like id createdOn etc. 
|  |- metric.model.ts             this model contains timestamp,address,value and sign for the metric.
|- repositories                   contains repositories from the above mentioned models
|- services                       contains services 
|  |- aggregate.service.ts        this service will provide adding value in average and substract value in average methods.
|  |- metric.service.ts           this service contains createMetricRecord and update Staled Metric Record data. 
|  |- stale-data.cron.ts.         this contains cronJob service which will run every 10sec interval to check stale data records. and update if any available. 
|  |- stale-data.service.ts       this contains methods to get staleTime period, list of staled records and make those stale records updated by subtract in average.
|- config.ts                      this contains config var staleTime  which can be used to configure different time. 

ui/                               ui project source code
|- config.json                    contains config variable like serverURL,interval and private key.
|- contact.js                     metamask integration code, which contains all methods for the operation and integration with wallet, sending api calls. etc
|- index.html                     html file - main entry 



```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm run test
```

or to check test coverage

```sh
npm run test:ci
```


