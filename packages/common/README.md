# @node-micro/common

Shared utility functions for configuration management and common operations within the [node-micro](https://github.com/nvharish/node-micro) microservice framework.

## Features

- **Configuration Loader**: Load YAML configuration files with validation and error handling.
- **Logger**: Structured logging using [pino](https://github.com/pinojs/pino), with support for redaction and custom formatting.
- **Error Handling**: Standardized error class for consistent error reporting.
- **Context Management**: Base context class for request/response lifecycle.
- **Utility Functions**: Common helpers such as UUID generation.

## Installation

```sh
npm install @node-micro/common
```

## Usage

> See the [documentation](https://github.com/nvharish/node-micro/tree/main/examples/http) for detailed API usage and examples.

## API

### Logger

Structured logger with redaction and formatting.

### NodeMicroError

Custom error class for consistent error handling.

### Utils

Utility functions (e.g., `uuid()`).

### NodeMicroContext

Base context class for request/response data.

### NodeMicroServer

Base server class for transport implementations.

## License

MIT © [N V Harish](https://github.com/nvharish)