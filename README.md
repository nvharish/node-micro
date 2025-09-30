# Node Micro

A modular microservice framework providing CLI, HTTP, and gRPC support for building scalable distributed systems.

## Features

- **CLI Tool**: Scaffold new microservice projects interactively.
- **HTTP & gRPC Support**: Build services using modern protocols.
- **Modular Architecture**: Easily extend and compose microservices.
- **Workspace Structure**: Organize code with packages for CLI, HTTP, gRPC, and common utilities.
- **Developer Tools**: Includes linting, testing, and code formatting scripts.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 7

### Installation

Clone the repository:

```sh
git clone https://github.com/nvharish/node-micro.git
cd node-micro
npm install
```

### Scaffold a Microservice

You can use the CLI to generate a new microservice:

```sh
npx @node-micro/cli
# or
npm init @node-micro/cli
```

Follow the prompts to set up your service.

### Scripts

- `npm run lint` — Run ESLint
- `npm run lint:fix` — Fix lint errors
- `npm run test` — Run tests with Mocha
- `npm run test:coverage` — Test coverage with NYC
- `npm run audit` — Security audit
- `npm run outdated` — Check outdated dependencies

## Monorepo Structure

```
node-micro/
├── packages/
│   ├── cli/      # CLI tool
│   ├── http/     # HTTP microservice package
│   ├── grpc/     # gRPC microservice package
│   └── common/   # Shared utilities
├── examples/     # Example microservices
├── .github/      # GitHub workflows and templates
├── package.json  # Root configuration
└── README.md
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md).

## License

MIT © [N V Harish](https://github.com/nvharish)

## Links

- [Issues](https://github.com/nvharish/node-micro/issues)
- [Homepage](https://github.com/nvharish/node-micro#readme)