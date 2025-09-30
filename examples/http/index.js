const { getPetsById } = require('./src/handlers/getPetsById')
const { createPets } = require('./src/handlers/createPets')
const errorHandler = require('./src/error-handler/error')

module.exports = {
    getPetsById,
    createPets,
    errorHandler // inject custom error handler. NOTE key name must be errorHandler
}
