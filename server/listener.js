var dns = require('native-dns');
var config = require('./config.js'),
  cache = require('./cache.js');

var separator = '@',
  miss_ip = '0.0.0.0';

var dict = {}, proxy = '', domains = [], 
  settings = config.getSettings('settings.json');
if(settings.proxy){
  proxy = settings.proxy;
}
if(settings.domains){
  domains = config.getSettings(settings.domains);
}
domains.map(function(domain){
  dict[domain] = 1;
});

function sendResponse(response, domain, ips){
  //console.log(domain, ips);
  ips.map(function(ip){
    var isIPV6 = false;
    if(ip.indexOf(separator) > -1){
      var arr = ip.split(separator);
      ip = arr[0];
      isIPV6 = ('6' === arr[1]);
    }
    if(ip != miss_ip){
      var address;
      if(isIPV6){
        address = dns.AAAA({ name: domain, address: ip, ttl: 600 });
      }else{
        address = dns.A({ name: domain, address: ip, ttl: 600 });
      }
      response.answer.push(address);
    }
  });
  response.send();
}

module.exports = {
    onMessage: function (request, response) {
      var domain = request.question[0].name;
      if (dict.hasOwnProperty(domain) && proxy) {
        sendResponse(response, domain, [proxy]);
      }else{
        cache.resolve(domain, function(err, results){
          if (err) {
            console.error('listener cache.resolve');
  console.log(domain);
            console.error(err);
          }
          if(results && results.length){
            console.log('results && results.length');
  console.log(domain);
            console.log(results);
            sendResponse(response, domain, results);
          }else{
            console.log('else');
  console.log(domain);
            console.log(results);
            dns.lookup(domain, function (err, address, afamily) {
              if (err) {
                console.error('listener dns.lookup');
  console.log(domain);
                console.error(err);
              }
              address = address || miss_ip;
              afamily = afamily || 4;
              address = [address, afamily].join(separator);
              cache.push(domain, address);
if(err){
  console.log('listener dns.lookup');
  console.log(domain);
  console.log(address);
}
              sendResponse(response, domain, [address]);
            });
          }
        });
      }
    },
    onError: function (err, buff, req, res) {
      console.error('listener onError');
      console.error(err.stack);
    },

    onListening: function () {
      console.log('dns server listening');
    },

    onSocketError: function (err, socket) {
      console.error('listener onSocketError');
      console.error('dns onSocketError', err);
    },

    onClose: function () {
      console.log('dns server closed');
    }
};