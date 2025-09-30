// Example handler for ServerStreamHello

async function serverStreamHello(ctx) {
  const { name } = ctx.req.message;

  // Send 5 greeting messages as a stream
  const messages = [];
  for (let i = 1; i <= 5; i++) {
    messages.push({ message: `Hello ${name}, message #${i}` });
  }

  return {
    message: messages,
    metadata: {}, //response metadata
    trailers: {} //response trailers
  }
}

module.exports = { serverStreamHello };