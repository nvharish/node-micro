const errorHandler = require('./src/error-handler/error')
const { bidiHello } = require('./src/handlers/bidiHello')
const { clientStreamHello } = require('./src/handlers/clientStreamHello')
const { serverStreamHello } = require('./src/handlers/serverStreamHello')
const { unaryHello } = require('./src/handlers/unaryHello')

module.exports = {
    unaryHello,
    serverStreamHello,
    clientStreamHello,
    bidiHello,
    errorHandler
}
