// custom error handler
module.exports = function (error, ctx) {
  return {
    code: 13,
    details: error.details || 'Internal Error'
  }
}