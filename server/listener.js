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
  console.log(domain, ips);
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
console.log('step 1');
      //domain = domain.replace(/(^s*)|(s*$)/g, '');
      if (dict.hasOwnProperty(domain) && proxy) {
console.log('step 20');
        sendResponse(response, domain, [proxy]);
      }else{
        console.log('domain:', domain, ';');
        console.log('length:', domain.length);
console.log('step 21');
        cache.resolve(domain, function(err, results){
          if(results && results.length){
console.log('step 30');
            sendResponse(response, domain, results);
          }else{
console.log('step 31');
            dns.lookup(domain, function (err, address, afamily) {
              if (err) {
console.log('step 40');
                console.error(err);
              } else {
console.log('step 41');
                address = address || miss_ip;
                afamily = afamily || 4;
                address = [address, afamily].join(separator);
                cache.push(domain, address);
                sendResponse(response, domain, [address]);
              }
            });
          }
        });
      }
    },
    onError: function (err, buff, req, res) {
      console.error('onError:', err.stack);
    },

    onListening: function () {
      console.log('server listening on', this.address());
    },

    onSocketError: function (err, socket) {
      console.error('onSocketError', err);
    },

    onClose: function () {
      console.log('server closed', this.address());
    }
};