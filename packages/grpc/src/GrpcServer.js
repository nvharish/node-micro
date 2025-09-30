const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { NodeMicroServer, NodeMicroError } = require('@node-micro/common');
const GrpcContext = require('./GrpcContext');

class GrpcServer extends NodeMicroServer {
  constructor(opts) {
    super(opts);
    try {
      const pkgDef = protoLoader.loadSync(this.spec, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })
      const grpcObj = grpc.loadPackageDefinition(pkgDef);

      const impl = {}
      Object.entries(this.config.grpc.methods).forEach(([method, opts]) => {
        const handlerKey = `get${opts.streaming}Handler`;
        if (!this[handlerKey]) {
          throw new NodeMicroError(`Invalid streaming option '${opts.streaming}'`);
        }
        impl[method] = this[handlerKey](method);
      })

      this.server = new grpc.Server();
      this.server.addService(grpcObj[this.config.grpc.package][this.config.grpc.service].service, impl);
    } catch (error) {
      this.logger.error({
        message: error?.message,
        cause: error?.cause,
        status: error?.statusCode || grpc.status.INTERNAL,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, 'server-error');
      throw new NodeMicroError(error.message, error);
    }
  }

  log(event, ctx = undefined, duration = undefined, code = undefined, error = undefined) {
    if (error) {
      error = {
        code: error?.code || grpc.status.INTERNAL,
        message: error?.message || 'Internal Error',
        cause: error?.cause || 'Internal Error',
        details: error?.details || 'Internal Error',
        stack: error?.stack
      };
    }

    const durationMs = duration ? `${duration}ms` : duration;
    const level = error ? 'error' : 'info';
    const clientAddress = ctx?.clientAddress || undefined;
    const request = ctx?.req || undefined;

    this.logger[level]({
      clientAddress,
      package: this.config.grpc.package,
      service: this.config.grpc.service,
      request,
      error,
      durationMs,
      code,
      timestamp: new Date().toISOString()
    }, event);
  }

  genMetadata(data) {
    const metadata = new grpc.Metadata();
    Object.entries(data).forEach(([key, val]) => metadata.set(key, val));
    return metadata;
  }

  loadContext(call, method) {
    const ctx = new GrpcContext(call, method, this.config).getContext();
    return ctx;
  }

  async getHandlerResponse(ctx, method) {
    const handlerKey = Object.keys(this.handlers).find((key) => method.toLowerCase() === key.toLowerCase());
    if (!handlerKey) {
      throw new NodeMicroError(`Handler not found for method: ${method}`, {
        cause: `Handler for method: ${method} is not exported as function`,
        details: `Handler for method: ${method} is not exported as function`
      }, grpc.status.INTERNAL);
    }
    const res = await this.handlers[handlerKey](ctx);

    return res;
  }

  getErrorResponse(error, ctx) {
    let res;
    if (this.handlers.errorHandler) {
      res = this.handlers.errorHandler(error, ctx);
    } else {
      res = this.defaultErrorHandler(error, ctx);
    }

    return res;
  }

  getUnaryHandler(method) {
    const self = this;

    return async (call, callback) => {
      const startTime = Date.now();
      const ctx = self.loadContext(call, method);

      self.log('unary-rpc-req-start', ctx);
      try {
        const res = await self.getHandlerResponse(ctx, method);

        const metadata = self.genMetadata(res.metadata ?? {});
        call.sendMetadata(metadata);

        const trailers = self.genMetadata(res.trailers ?? {});
        callback(null, res.message, trailers);

        const duration = Date.now() - startTime;
        self.log('unary-rpc-req-end', ctx, duration, grpc.status.OK);
      } catch (error) {
        const res = self.getErrorResponse(error, ctx);
        callback({ code: res.code ?? grpc.status.INTERNAL, details: res.details ?? 'Internal Error' });

        const duration = Date.now() - startTime;
        self.log('unary-rpc-error', ctx, duration, res.code ?? grpc.status.INTERNAL, error);
      }
    };
  }

  getServerHandler(method) {
    const self = this;

    return async (call) => {
      const startTime = Date.now();
      const ctx = self.loadContext(call, method);

      self.log('server-streaming-rpc-req-start', ctx);
      try {
        const res = await self.getHandlerResponse(ctx, method);

        const metadata = self.genMetadata(res.metadata ?? {});
        call.sendMetadata(metadata);

        if (Array.isArray(res.message)) {
          res.message.forEach((msg) => call.write(msg));
        } else if (res) {
          call.write(res.message);
        }

        const trailers = self.genMetadata(res.trailers ?? {});
        call.end(trailers);

        const duration = Date.now() - startTime;
        self.log('server-streaming-rpc-req-end', ctx, duration, grpc.status.OK);
      } catch (error) {
        const res = self.getErrorResponse(error, ctx);
        call.emit('error', { code: res.code ?? grpc.status.INTERNAL, details: res.details ?? 'Internal Error' });

        const duration = Date.now() - startTime;
        self.log('server-streaming-rpc-error', ctx, duration, res.code ?? grpc.status.INTERNAL, error);
      }
    }
  }

  getClientHandler(method) {
    const self = this;

    return (call, callback) => {
      const startTime = Date.now();
      self.log('client-streaming-rpc-start');

      const messages = [];
      call.on('data', function (data) {
        if (data) {
          messages.push(data);
          self.logger[self.config.logging.level || info]({ request: data }, 'client-streaming-rpc-req-received');
        }
      });

      call.on('end', async function () {
        const ctx = self.loadContext({ ...call, request: messages }, method);
        self.log('client-streaming-rpc-req-start', ctx);

        try {
          const res = await self.getHandlerResponse(ctx, method);

          const metadata = self.genMetadata(res.metadata ?? {});
          call.sendMetadata(metadata);

          const trailers = self.genMetadata(res.trailers);
          callback(null, res.message, trailers ?? {});

          const duration = Date.now() - startTime;
          self.log('client-streaming-rpc-req-end', ctx, duration, grpc.status.OK);
        } catch (error) {
          const res = self.getErrorResponse(error, ctx);
          callback({ code: res.code ?? grpc.status.INTERNAL, details: res.details ?? 'Internal Error' });

          const duration = Date.now() - startTime;
          self.log('client-streaming-rpc-error', ctx, duration, res.code ?? grpc.status.INTERNAL, error);
        }
      });

      call.on('error', (error) => {
        this.logger.error(error, 'client-streaming-rpc-error');
      });
    }
  }

  getBidirectionalHandler(method) {
    const self = this;

    return async (call) => {
      const startTime = Date.now();
      self.log('bidirectional-streaming-rpc-started');

      let ctx, res;
      call.on('data', async (data) => {
        if (data) {
          ctx = self.loadContext({ ...call, request: data }, method);
          self.log('bidirectional-streaming-rpc-req-start', ctx);

          try {
            res = await self.getHandlerResponse(ctx, method);

            const metadata = self.genMetadata(res.metadata);
            call.sendMetadata(metadata);

            call.write(res.message);
          } catch (error) {
            res = self.getErrorResponse(error, ctx);
            call.emit('error', { code: res.code ?? grpc.status.INTERNAL, details: res.details ?? 'Internal Error' });

            const duration = Date.now() - startTime;
            self.log('bidirectional-streaming-rpc-error', ctx, duration, res.code ?? grpc.status.INTERNAL, error);
          }
        }
      });

      call.on('end', () => {
        const trailers = self.genMetadata(res.trailers);
        call.end(trailers);

        const duration = Date.now() - startTime;
        self.log('bidirectional-streaming-rpc-req-end', ctx, duration, res.code ?? grpc.status.OK);
      });
    }
  }

  defaultErrorHandler(error, ctx) {
    return {
      code: error.code ?? grpc.status.INTERNAL,
      message: error.message ?? 'Internal Error',
      details: error.details ?? 'Internal Error',
    }
  }

  listen(port, host) {
    this.server.bindAsync(`${host || '0.0.0.0'}:${port || 3000}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        this.logger.error({
          message: error.message,
          cause: error?.cause,
          statusCode: 500,
          stack: error?.stack,
          timestamp: new Date().toISOString()
        }, 'server-error');

        throw new NodeMicroError(error.message, error);
      }

      this.logger.info({
        host: host || '0.0.0.0',
        port: port || 3000,
        timestamp: new Date().toISOString()
      }, 'server-started');

      this.logger.info(`Server is listening on port ${port}`);
    });
  }
}

module.exports = GrpcServer;