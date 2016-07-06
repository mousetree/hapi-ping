'use strict';

const Hapi = require('hapi');

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';
const server = new Hapi.Server();

/*
  We simply store the last date of
  each device's ping in memory.
 */
let pings = {};

server.connection({ 
  host: host, 
  port: port 
});

server.route({
  method: 'GET',
  path:'/', 
  handler: function (request, reply) {
    return reply(pings);
  }
});

server.route({
  method: 'POST',
  path:'/{device?}', 
  handler: function (request, reply) {
    let device = request.params.device || request.payload.device || 'default';
    let timestamp = new Date();
    pings[device] = timestamp;
    console.log(`${device} active`);
    return reply().code(201);
  }
});

server.start((err) => {
  if (err) { throw err; }
  console.log('server running at:', server.info.uri);
});