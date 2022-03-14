# metric-aggregator-service

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

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
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
