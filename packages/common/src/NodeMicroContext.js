class NodeMicroContext {
  constructor(config) {
    this.ctx = {
      config: {
        accessControl: config.accessControl,
        infra: config.infra
      }
    }
  }

  getContext() {
    return this.ctx;
  }
}

module.exports = NodeMicroContext;