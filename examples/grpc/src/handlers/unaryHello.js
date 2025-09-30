// Example handler for UnaryHello

async function unaryHello(ctx) {
  //console.log('context', JSON.stringify(ctx, ' ', 2))
  const { name } = ctx.req.message;

  return {
    message: { message: `Hello ${name}!` },
    metadata: {}, //response metadata
    trailers: {} //response trailers
  }
}

module.exports = { unaryHello }