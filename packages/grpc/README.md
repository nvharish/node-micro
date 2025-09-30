# @node-micro/grpc

gRPC transport layer for the [node-micro](https://github.com/nvharish/node-micro) microservice framework, enabling efficient RPC communication between services.

## Features

- Seamless gRPC integration for node-micro services
- Efficient, high-performance RPC communication
- Easy-to-use CLI for managing gRPC services
- Built on top of [`@grpc/grpc-js`](https://www.npmjs.com/package/@grpc/grpc-js) and [`@grpc/proto-loader`](https://www.npmjs.com/package/@grpc/proto-loader)
- Seamless integration with [`@node-micro/common`](https://www.npmjs.com/package/@node-micro/common)

## Installation

```bash
npm install @node-micro/grpc
```

## Usage

### CLI

You can use the CLI to manage gRPC services:

```bash
npx node-micro-grpc --spec=spec.proto --config=config/dev.yaml index.js
```

### Programmatic Usage

> See the [documentation](https://github.com/nvharish/node-micro/tree/main/examples/grpc) for detailed API usage and examples.

## API

> **Note:** Please refer to the [documentation](https://github.com/nvharish/node-micro/tree/main/examples/grpc) for detailed API usage and examples.

## Contributing

Contributions are welcome! Please open issues or pull requests on [GitHub](https://github.com/nvharish/node-micro).

## License

MIT © N V Harish

---
[Report bugs](https://github.com/nvharish/node-micro/issues)