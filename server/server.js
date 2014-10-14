"use strict";

var path = require('path');
var dns = require('native-dns'),
  tcpserver = dns.createTCPServer(),
  server = dns.createServer();

var configDir = path.resolve(__dirname, '..', '..', '..', 'config');

var config = require('./config.js')(configDir),
  listener = require('./listener.js');

var address = '';

console.log(config.settings);

if(config.settings.address){
  address = config.settings.address;
}

server.on('request', listener.onMessage);
server.on('error', listener.onError);
server.on('listening', listener.onListening);
server.on('socketError', listener.onSocketError);
server.on('close', listener.onClose);

tcpserver.on('request', listener.onMessage);
tcpserver.on('error', listener.onError);
tcpserver.on('listening', listener.onListening);
tcpserver.on('socketError', listener.onSocketError);
tcpserver.on('close', listener.onClose);

if(address){
  server.serve(53, address);
  tcpserver.serve(53, address);
  console.log('server running!');
}else{
  console.log('server address error.');
}
