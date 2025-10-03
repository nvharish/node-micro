// Example handler for ClientStreamHello

async function clientStreamHello(ctx) {
  const { message = [] } = ctx.req;

  return {
    message: { message: `Hello ${message.map((v) => v.name).join(', ')}!` },
    metadata: {}, //response metadata
    trailers: {}, //response trailers
  };
}

module.exports = { clientStreamHello };