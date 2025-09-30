const yaml = require('js-yaml');
const fs = require('node:fs');

const NodeMicroError = require('./NodeMicroError');

class Config {
  constructor(configPath) {
    if (!fs.existsSync(configPath)) {
      throw new NodeMicroError(`File not found: ${configPath}`);
    }

    try {
      this.config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      throw new NodeMicroError(error.message, error);
    }
  }
}

module.exports = Config;