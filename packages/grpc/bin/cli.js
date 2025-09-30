#!/usr/bin/env node
const GrpcServer = require("../src/GrpcServer")

try {
  const server = new GrpcServer(process.argv);
  server.listen(process.env.PORT, process.env.HOST);
} catch (error) {
  console.error(error)
}