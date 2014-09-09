var redis = require('./redis.js');

var redis_db_name = 'basic',
    separator = '_',
    prefix = 'dns_domain_ip4';

function getCacheKey(domain){
    return [prefix, domain].join(separator);
};

function resolve(domain, callback){
    redis.createClient(redis_db_name)
    .then(function(client){
        var key = getCacheKey(domain);
        client.smembers(key, function(err, results){
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
    callback = callback || function(){};
    redis.createClient(redis_db_name)
    .then(function(client){
        var key = getCacheKey(domain);
        client.sadd(key, ip, function(err, result){
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
