const { NodeMicroContext } = require('@node-micro/common');

class RestContext extends NodeMicroContext {
  constructor(req, config) {
    super(config);
    this.ctx.req = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.querystring,
      params: req.params,
      body: req.body,
    };
  }
}

module.exports = RestContext;