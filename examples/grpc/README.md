# grpc-example

Example gRPC microservice built with [Node Micro](https://github.com/nvharish/node-micro).

## Features

- Demonstrates gRPC transport using Node Micro
- Includes example service definition ([spec.proto](spec.proto))
- Configurable via YAML files ([config/dev.yaml](config/dev.yaml), [config/staging.yaml](config/staging.yaml), [config/prod.yaml](config/prod.yaml))
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
├── spec.proto      # gRPC service definition
├── index.js        # Entry point for handlers
├── package.json
└── README.md
```

## Usage

### Programmatic Usage

- Define your service spec in the [spec.proto](spec.proto) file. See the [protobuf documentation](https://protobuf.dev/overview/) to learn more.
- Map your gRPC [spec's](spec.proto) package name, service name, service methods with your respective handlers along with the streaming options in all the [config files](config/dev.yaml). For example, if the gRPC package name is *example*, the service name is *ExampleService*, and *UnaryHello* is a unary RPC method of *ExampleService*, then you should specify it as follows in all the config files (config/dev.yaml, config/staging.yaml, config/prod.yaml):
  ```yaml
  grpc:
    package: example
    service: ExampleService
    methods:
      UnaryHello:
        streaming: Unary
  ```
- Create a handler function for each service method declared in the [config files](config/dev.yaml). Write your logic inside the handler function. NOTE: The handler function must follow the signature and return type as specified in the [example](src/handlers/unaryHello.js).
- Export the handlers as an object in [index.js](index.js). NOTE: The handler names must match (case-insensitive) with the service method names defined in the [spec.proto](spec.proto).
- Define a custom [error handler](src/error-handler/error.js) to render a custom error response. NOTE: The error handler function must follow the required signature and return type, and it must be exported in [index.js](index.js) as *errorHandler*.
- Start the service using the following command:
  ```sh
  npm start
  ```
- The [Node Micro](https://github.com/nvharish/node-micro) framework will, by default, starts listening on host *0.0.0.0* at port *3000*. To customize the host and port, create a *.env* file and specify the host and port as environment variables. See [.env.sample](.env.sample).

> See the [gRPC documentation](https://grpc.io/docs/) to learn more about gRPC.

### Running the Service

Start the gRPC service:

```sh
npm start
```

This runs:

```sh
node-micro-grpc --spec=spec.proto --config=config/dev.yaml index.js
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
  "start": node-micro-grpc --spec=spec.proto --config=config/staging.yaml index.js
  ```
- You can have as many environment config files as per your requirements.
- Environment variables can be set in a `.env` file (see [.env.sample](.env.sample)).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md).

## License

MIT © [N V Harish](https://github.com/nvharish/node-micro)