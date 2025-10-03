#!/usr/bin/env node
const RestServer = require('../src/RestServer');

try {
  const server = new RestServer(process.argv);
  server.listen(process.env.PORT, process.env.HOST);
} catch (error) {
  console.error(error);
}