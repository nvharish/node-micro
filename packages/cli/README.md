# @node-micro/cli

A command-line tool to scaffold and generate microservice projects with Node Micro. Supports interactive prompts and project templates for rapid microservice development.

## Features

- **Interactive CLI**: Easily scaffold new microservice projects.
- **Project Templates**: Supports HTTP and gRPC protocols.
- **Config Generation**: Automatically generates configuration files.
- **Developer Tools**: Integrates with linting, testing, and formatting tools.

## Installation

You can use the CLI directly with `npx` or via `npm init`:

```sh
npx @node-micro/cli
# or
npm init @node-micro/cli
```

## Usage

Follow the prompts to set up your microservice:

```sh
npx @node-micro/cli
```

## Scripts

- `npm run lint` — Run ESLint
- `npm run lint:fix` — Fix lint errors
- `npm run test` — Run tests with Mocha
- `npm run test:coverage` — Test coverage with NYC

## Contributing

See [CONTRIBUTING.md](../../.github/CONTRIBUTING.md) for guidelines.

## License

MIT © [N V Harish](https://github.com/nvharish/node-micro)