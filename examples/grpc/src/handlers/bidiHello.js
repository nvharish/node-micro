// Example handler for ServerStreamHello

async function bidiHello(ctx) {
  const { name } = ctx.req.message;
  const message = `Hello ${name}!`;
  return {
    message: { message },
    metadata: {}, //response metadata
    trailers: {}, //response trailers
  };
}

module.exports = { bidiHello };