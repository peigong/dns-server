"use strict";

var dns = require('native-dns'),
  tcpserver = dns.createTCPServer(),
  server = dns.createServer();

var config = require('./config.js'),
  listener = require('./listener.js');

var address = '', 
  settings = config.getSettings('settings.json');
console.log(settings);
if(settings.address){
  address = settings.address;
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
  console.log('address error.');
}
