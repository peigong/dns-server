var redis = require('./redis.js');

var redis_db_name = 'basic',
    separator = '_',
    prefix = 'dns_domain_ip4';

function getCacheKey(domain){
    return [prefix, domain].join(separator);
};

function resolve(domain, callback){
//var step0 = (new Date()).getTime();
    redis.createClient(redis_db_name)
    .then(function(client){
        var key = getCacheKey(domain);
//var step1 = (new Date()).getTime();
//console.log(domain, ' resolve-step1 ', step1 - step0);
        client.smembers(key, function(err, results){
//var step2 = (new Date()).getTime();
//console.log(domain, ' resolve-step2 ', step2 - step1);
            callback(err, results);
        });
    })
    .catch(function(err){
        callback(err);
    })
    .finally(function(){
        redis.release(redis_db_name, client);
    });
}

function push(domain, ip, callback){
//var step0 = (new Date()).getTime();
    callback = callback || function(){};
    redis.createClient(redis_db_name)
    .then(function(client){
//var step1 = (new Date()).getTime();
//console.log(domain, ' push-step1 ', step1 - step0);
        var key = getCacheKey(domain);
        client.sadd(key, ip, function(err, result){
//var step2 = (new Date()).getTime();
//console.log(domain, ' push-step2 ', step2 - step1);
            callback(err, result);
        });
    })
    .catch(function(err){
        callback(err);
    })
    .finally(function(){
        redis.release(redis_db_name, client);
    });
}

module.exports = {
    resolve: resolve,
    push: push
};
