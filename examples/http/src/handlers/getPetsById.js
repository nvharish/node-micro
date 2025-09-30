const { NodeMicroError } = require("@node-micro/common")

const pets = []

async function getPetsById(ctx) {
  const { req } = ctx
  const pet = pets.find(p => p.id === Number(req.params.id))

  // throw new NodeMicroError("Something went wrong from getPetsById handler")

  if (!pet) {
    return {
      status: 404,
      body: { error: 'Pet not found' },
      headers: { 'Content-Type': 'application/json' }
    }
  }

  return {
    status: 200,
    body: pet,
    headers: { 'Content-Type': 'application/json' }
  }
}

module.exports = { getPetsById, pets }