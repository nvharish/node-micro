# @node-micro/http

HTTP transport layer for the [node-micro](https://github.com/nvharish/node-micro) microservice framework, enabling RESTful communication between services.

## Features

- Fast and lightweight HTTP server powered by [Fastify](https://www.fastify.io/)
- OpenAPI integration via [fastify-openapi-glue](https://github.com/seriousme/fastify-openapi-glue)
- Modular architecture for scalable microservices
- Seamless integration with [`@node-micro/common`](https://www.npmjs.com/package/@node-micro/common)
- CLI for easy service startup

## Installation

```sh
npm install @node-micro/http
```

## Usage

### CLI

Start an HTTP microservice using the CLI:

```sh
npx node-micro-http --spec=spec.yaml --config=config/dev.yaml index.js
```

### Programmatic Usage

> See the [documentation](https://github.com/nvharish/node-micro/tree/main/examples/http) for detailed API usage and examples.

## API

> See the [documentation](https://github.com/nvharish/node-micro/tree/main/examples/http) for detailed API usage and examples.

## Contributing

Contributions are welcome! Please open issues or pull requests on [GitHub](https://github.com/nvharish/node-micro).

## License

MIT © N V Harish

---
[Report bugs](https://github.com/nvharish/node-micro/issues)