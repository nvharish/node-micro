const pino = require('pino');
const os = require('os');
const path = require('path');
const fs = require('fs');

class Logger {
  constructor(config) {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const transport = {
      target: 'pino/file',
      options: {
        translateTime: 'yyyy-mm-dd HH:MM:ss Z',
        ignore: 'pid,hostname',
        destination: path.join(logDir, 'app.log'),
      },
    };

    const redaction = Array.isArray(config.logging?.redaction)
      ? config.logging.redaction.map((path) => `req.headers["${path.trim()}"]`)
      : [];

    const redact = ['req.headers.authorization', ...redaction].filter((v, i, a) => a.indexOf(v) === i); // unique

    if (config.logging.level === 'debug') {
      transport.target = 'pino-pretty';
      transport.colorize = true;
      delete transport.options.destination;
    }

    this.logger = pino({
      transport,
      level: config.logging?.level ?? 'info',
      safe: true,
      redact,
      formatters: {
        level(label, number) {
          return {
            levelNum: number,
            level: label.toUpperCase(),
          };
        },
        bindings(bindings) {
          return {
            pid: bindings.pid,
            hostname: bindings.hostname,
            name: `node-micro v${require('../package.json').version}`,
          };
        },
        log(object) {
          return {
            resource: {
              'service-name': config.infra.serviceName || 'unknown-service',
              'service-version': config.infra.serviceVersion || 'unknown-version',
              'host-arch': os.arch(),
              'host-platform': os.platform(),
              'host-cpus': os.cpus().length,
              'host-memory': `${Math.ceil(os.totalmem() / (1024 * 1024))} MB`,
              'host-name': os.hostname(),
              'node-version': process.version,
              'node-micro-pod-start-time': new Date().toISOString(),
            },
            ...object,
          };
        },
      },
    });
  }

  load() {
    return this.logger;
  }
}

module.exports = Logger;