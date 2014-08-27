"use strict";

var path = require('path'), 
  dns = require('native-dns'),
  server = dns.createServer();

var config = path.resolve(__dirname, '..', '..', '..', 'config');
var dict = {}, proxy = '', domains = [], settings = require(path.join(config, 'settings.json'));
if(settings.proxy){
  proxy = settings.proxy;
}
if(settings.domains){
  domains = require(path.join(config, [settings.domains, 'json'].join('.')));
}
domains.map(function(domain){
  dict[domain] = 1;
});

var sendResponse = function(response, domain, ips){
  ips = ips || [];
  ips.map(function(ip){
    response.answer.push(dns.A({
      name: domain,
      address: ip,
      ttl: 600
    }));
  });
  response.send();
}
  
var onMessage = function (request, response) {
  var domain = request.question[0].name;
  if (dict.hasOwnProperty(domain) && proxy) {
    console.log([domain, proxy].join(':'));
    sendResponse(response, domain, [proxy]);
  }else{
    dns.resolve(domain, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        results = results || [];
        console.log([domain, results.join(',')].join(':'));
        sendResponse(response, domain, results);
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

server.serve(53, '127.0.0.1');
console.log('dns server running!')
