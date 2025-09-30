const { pets } = require('./getPetsById')

let idCounter = 1

async function createPets(ctx) {
  const { req } = ctx
  const pet = { id: idCounter++, ...req.body }
  pets.push(pet)
  return {
    status: 201,
    body: pet,
    headers: { 'Content-Type': 'application/json' }
  }
}

module.exports = { createPets }