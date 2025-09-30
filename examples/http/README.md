# http-example

Example HTTP microservice built with [Node Micro](https://github.com/nvharish/node-micro).

## Features

- RESTful API powered by [Fastify](https://www.fastify.io/)
- OpenAPI spec ([spec.yaml](spec.yaml)) for endpoint documentation
- Configurable via YAML files ([config/dev.yaml](config/dev.yaml), [config/staging.yaml](config/staging.yaml), [config/prod.yaml](config/prod.yaml))
- Structured logging and error handling
- Supports linting, testing, and code formatting

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 7

### Installation

You can use the CLI directly with `npx` or via `npm init`:

```sh
npx @node-micro/cli
# or
npm init @node-micro/cli
```

## Project Structure

```
examples/grpc/
├── config/         # Environment configs (YAML)
├── src/            # Service handlers and error handling
├── spec.yaml       # OpenAPI spec for endpoints
├── index.js        # Entry point for handlers
├── package.json
└── README.md
```

## Usage

### Programmatic Usage

- Define your service spec in the [spec.yaml](spec.yaml) file. See the [OpenAPI specification](https://swagger.io/specification/) to learn more.
- [Node Micro](https://github.com/nvharish/node-micro) framework will initialize the routes specified in [spec.yaml](spec.yaml) automatically.
- Each route specified in [spec.yaml](spec.yaml) must have an *operationId*.
- Map each *operationId* mentioned in [spec.yaml](spec.yaml) with your respective [handler function](src/handlers/createPets.js). Write your logic inside these handler functions. NOTE: The handler function must follow the signature and return type as specified in the [example](src/handlers/createPets.js).
- Export the handlers as an object in [index.js](index.js). NOTE: The handler name must match (case-sensitive) with the *operationId* mentioned in the [spec.yaml](spec.yaml).
- Define a custom [error handler](src/error-handler/error.js) to render a custom error response. NOTE: The error handler function must follow the required signature and return type, and it must be exported in [index.js](index.js) with *errorHandler* key name.
- Start the service using the following command:
  ```sh
  npm start
  ```
- The [Node Micro](https://github.com/nvharish/node-micro) framework will, by default, start listening on host *0.0.0.0* at port *3000*. To customize the host and port, create a *.env* file and specify the host and port as environment variables. See [.env.sample](.env.sample).

### Running the Service

Start the HTTP service:

```sh
npm start
```

This runs:

```sh
node-micro-http --spec=spec.yaml --config=config/dev.yaml index.js
```

### Development

Start in development mode (with auto-reload):

```sh
npm run dev
```

### Linting

Run ESLint:

```sh
npm run lint
```

Auto-fix lint errors:

```sh
npm run lint:fix
```

### Testing

Run tests with Mocha:

```sh
npm test
```

Test coverage:

```sh
npm run test:coverage
```

### Security & Maintenance

Audit dependencies:

```sh
npm run audit
npm run audit:fix
```

Check for outdated dependencies:

```sh
npm run outdated
npm run outdated:fix
```

## Configuration

- Service configuration is managed via YAML files in the `config/` directory.
- Use the environment specific config file during deployment. For example, use [dev.yaml](config/dev.yaml) for local development, [staging.yaml](config/staging.yaml) for staging server etc. You must pass the respective environment config file as an argument to the cli command mentioned in the scripts section of [package.json](package.json). For example to deploy the service in staging server, change the *--config* argument as follows:
  ```json
  "start": node-micro-http --spec=spec.yaml --config=config/staging.yaml index.js
  ```
- You can have as many environment config files as per your requirements.
- Environment variables can be set in a `.env` file (see [.env.sample](.env.sample)).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md).

## License

MIT © [N V Harish](https://github.com/nvharish/node-micro)