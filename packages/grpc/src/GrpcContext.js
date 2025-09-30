const { NodeMicroContext } = require("@node-micro/common");

class GrpcContext extends NodeMicroContext {
  constructor(call, method, config) {
    super(config);
    this.ctx.clientAddress = call.getPeer ? call.getPeer() : 'unknown';
    this.ctx.package = config.grpc.package;
    this.ctx.service = config.grpc.service;
    this.ctx.req = {
      method,
      metadata: call.metadata ? { ...call.metadata.getMap() } : {},
      message: call.request
    };
  }
}

module.exports = GrpcContext;