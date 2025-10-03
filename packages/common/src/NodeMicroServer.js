const path = require('node:path');
const fs = require('node:fs');

const NodeMicroError = require('./NodeMicroError');
const Config = require('./Config');
const Logger = require('./Logger');

class NodeMicroServer extends Config {
  constructor(opts) {
    require('dotenv').config();
    if (opts.length === 0) {
      throw new NodeMicroError('Please provide a file path and options: node-micro --spec=[specFilePath] --config=[configFilePath] src/index.js');
    }

    const args = opts.slice(2).reduce((a, v) => (v = v.split('='), a[v.length > 1 ? v[0].replace('--', '') : 'handlers'] = v[v.length - 1], a), {});

    const configPath = path.resolve(process.cwd(), args.config);
    super(configPath);

    this.spec = path.resolve(process.cwd(), args.spec);
    if (!fs.existsSync(this.spec)) {
      throw new NodeMicroError(`File not found: ${this.spec}`);
    }

    const handlerPath = path.resolve(process.cwd(), args.handlers);
    if (!fs.existsSync(handlerPath)) {
      throw new NodeMicroError(`File not found: ${handlerPath}`);
    }

    const handlers = require(handlerPath);
    if (typeof handlers !== 'object') {
      throw new NodeMicroError('Exported module must be a object that returns handler function');
    }

    const nonHandler = Object.keys(handlers).find((key) => typeof handlers[key] !== 'function');
    if (nonHandler) {
      throw new NodeMicroError(`Exported module '${nonHandler}' must be function that returns a object`);
    }
    this.handlers = handlers;

    this.logger = new Logger(this.config).load();
  }

  listen() { };
}

module.exports = NodeMicroServer;