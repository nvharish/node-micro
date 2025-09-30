class NodeMicroError extends Error {
  constructor(message, error = undefined, code = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;

    if (error) {
      Object.entries(error).forEach(([key, val]) => this[key] = val);
      this.cause = error.cause || 'Internal Error';
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = NodeMicroError;
