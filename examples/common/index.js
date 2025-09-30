const { Config, Logger, NodeMicroContext, Utils } = require('@node-micro/common');

const config = new Config(process.cwd() + '/local.yaml').load();

console.log(config);

const logger = new Logger(config);

logger.info({
  message: 'hello world'
}, 'hello-world')
