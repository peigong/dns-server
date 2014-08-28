"use strict";

var dns = require('native-dns'),
  tcpserver = dns.createTCPServer(),
  server = dns.createServer();

var config = require('./config.js'),
  cache = require('./cache.js');

var dict = {}, address = '', proxy = '', domains = [], settings = config.getSettings('settings.json');
console.log(settings);
if(settings.address){
  address = settings.address;
}
if(settings.proxy){
  proxy = settings.proxy;
}
if(settings.domains){
  domains = config.getSettings(settings.domains);
}
domains.map(function(domain){
  dict[domain] = 1;
});

var sendResponse = function(response, domain, ips){
  console.log(domain, ips);
  ips.map(function(ip){
    if(ip){
      response.answer.push(dns.A({
        name: domain,
        address: ip,
        ttl: 600
      }));
    }
  });
  response.send();
}
   
var onMessage = function (request, response) {
  var domain = request.question[0].name;
  if (dict.hasOwnProperty(domain) && proxy) {
    sendResponse(response, domain, [proxy]);
  }else{
    cache.resolve4(domain, function(err, results){
      if(results && results.length){
        sendResponse(response, domain, results);
      }else{
        dns.lookup(domain, function (err, address, afamily) {
          if (err) {
            console.log(err);
          } else {
            address = address || 0;
            cache.push(domain, address);
            sendResponse(response, domain, [address]);
          }
        });
      }
    });
  }
};
var onError = function (err, buff, req, res) {
  console.log(err.stack);
};

var onListening = function () {
  console.log('server listening on', this.address());
};

var onSocketError = function (err, socket) {
  console.log(err);
};

var onClose = function () {
  console.log('server closed', this.address());
};

server.on('request', onMessage);
server.on('error', onError);
server.on('listening', onListening);
server.on('socketError', onSocketError);
server.on('close', onClose);

tcpserver.on('request', onMessage);
tcpserver.on('error', onError);
tcpserver.on('listening', onListening);
tcpserver.on('socketError', onSocketError);
tcpserver.on('close', onClose);

if(address){
  server.serve(53, address);
  tcpserver.serve(53, address);
  console.log('server running!');
}else{
  console.log('address error.');
}
