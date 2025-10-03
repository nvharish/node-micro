// custom error handler
module.exports = function (error, _ctx) {
  return {
    status: 500,
    body: { error: error.message || 'Internal Server Error', cause: error.cause },
    headers: { 'Content-Type': 'application/json' },
  };
};