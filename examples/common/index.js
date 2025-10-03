const fs = require('fs');
const yaml = require('js-yaml');
const { Logger } = require('@node-micro/common');

const config = yaml.load(fs.readFileSync('local.yaml', 'utf8'));
const logger = new Logger(config).load();

logger.info({
  message: 'hello world',
}, 'hello-world');
