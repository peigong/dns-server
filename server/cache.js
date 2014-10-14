var createRedis = require('server-helpers').redis;

var redis = null, 
    separator = '_',
    redis_db_name = 'basic',
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

module.exports = function(config){
    var settings = config.getSettings('redis');
    console.log(settings);
    redis = createRedis(settings);
    return {
        resolve: resolve,
        push: push
    };
};
