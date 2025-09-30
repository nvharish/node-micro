const openapiGlue = require('fastify-openapi-glue')
const fastify = require('fastify');
const { NodeMicroServer, Utils, Logger, NodeMicroError } = require('@node-micro/common');
const RestContext = require('./RestContext');

class RestServer extends NodeMicroServer {
  constructor(opts) {
    super(opts);
    try {
      this.server = fastify({
        genReqId: (request) => request.headers['x-request-id'] || Utils.uuid(),
        trustProxy: process.env.TRUSTPROXY ?? false,
        loggerInstance: new Logger(this.config).load(),
        disableRequestLogging: true,
        connectionTimeout: 60000,
        requestTimeout: process.env.TIMEOUT || 30000,
        ajv: {
          customOptions: {
            strict: true,
            allErrors: true,
            removeAdditional: 'all',
            strictTypes: true,
            strictTuples: true,
            strictRequired: true,
            coerceTypes: 'array',
          },
        },
      });

      this.server.register(openapiGlue, {
        specification: this.spec,
        operationResolver: (operationId) => this.resolveHandler(operationId)
      });

      const self = this;

      // set error handler
      this.server.setErrorHandler((error, request, reply) => {
        let errResp;
        const ctx = new RestContext(request, self.config).getContext();

        if (this.handlers.hasOwnProperty('errorHandler')) {
          errResp = this.handlers['errorHandler'](error, ctx);
        } else {
          errResp = this.defaultErrorHandler(error, ctx);
        }
        reply.status(errResp.status);
        reply.headers = errResp.headers;
        reply.send(errResp.body);
      })

      //initialize hooks
      this.initHooks();
    } catch (error) {
      throw new NodeMicroError(error.message, error);
    }
  }

  resolveHandler(operationId) {
    if (!this.handlers[operationId]) {
      throw new NodeMicroError(`Handler not found for operationId: ${operationId}`, {
        cause: `Handler for operationId: ${operationId} is not exported as a function`,
      });
    }

    const self = this;
    return async function (request, reply) {
      const ctx = new RestContext(request, self.config).getContext();
      const res = await self.handlers[operationId](ctx)
      reply.headers = res.headers
      reply.status(res.status);
      return res.body
    }
  }

  initHooks() {
    const traceLog = {};
    const requestLog = {};
    const responseLog = {};
    const errorLog = {};

    // Helper to set trace headers
    const setTraceHeaders = (headers) => {
      headers['x-b3-traceid'] = headers['x-b3-traceid'] || Utils.uuid();
      headers['x-b3-spanid'] = headers['x-b3-spanid'] || Utils.uuid();
      headers['x-b3-parentspanid'] = headers['x-b3-parentspanid'] || null;
      headers['x-b3-flags'] = headers['x-b3-flags'] || '0';
    };

    this.server.addHook('onReady', (done) => {
      this.server.log.info('server-ready');
      done();
    });

    this.server.addHook('preHandler', (request, reply, done) => {
      request.headers['x-request-id'] = request.id;
      setTraceHeaders(request.headers);
      Object.assign(traceLog, {
        'x-request-id': request.headers['x-request-id'],
        'x-b3-traceid': request.headers['x-b3-traceid'],
        'x-b3-spanid': request.headers['x-b3-spanid'],
        'x-b3-parentspanid': request.headers['x-b3-parentspanid'],
        'x-b3-flags': request.headers['x-b3-flags'],
      });
      done();
    });

    this.server.addHook('onRequest', (request, reply, done) => {
      Object.assign(requestLog, {
        method: request.method,
        url: request.url,
        query: request.query,
        headers: request.headers,
        params: request.params,
        host: request.hostname,
        port: request.socket?.remotePort,
        remoteAddress: request.ip,
      });
      this.server.log.info({ trace: traceLog, ...requestLog }, 'http-request-start');
      done();
    });

    this.server.addHook('onResponse', (request, reply, done) => {
      Object.assign(responseLog, {
        statusCode: reply.statusCode,
        responseHeaders: typeof reply.getHeaders === 'function' ? reply.getHeaders() : reply.headers,
        responseTime: `${Math.round(reply.elapsedTime || 0)}ms`,
      });
      this.server.log.info({ trace: traceLog, ...requestLog, ...responseLog }, 'http-request-end');
      done();
    });

    this.server.addHook('onError', (request, reply, error, done) => {
      Object.assign(errorLog, {
        statusCode: error.statusCode || 500,
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        signal: error.signal,
      });
      this.server.log.error({ trace: traceLog, ...requestLog, ...errorLog }, 'http-error');
      done();
    });
  }

  defaultErrorHandler(error, ctx) {
    return {
      status: error.statusCode ?? 500,
      message: error.message,
      cause: error?.cause,
    }
  }

  listen(port, host) {
    this.server.listen({
      port: port || 3000,
      host: host || '0.0.0.0'
    }, (error) => {
      if (error) {
        throw new NodeMicroError(error.message, error);
      }
    });
  }
}

module.exports = RestServer;