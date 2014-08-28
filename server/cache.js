var redis = require('./redis.js');

var redis_db_name = 'basic',
    separator = '_',
    prefix = 'dns_domain_ip4';

function getCacheKey(domain){
    return [prefix, domain].join(separator);
};

function resolve4(domain, callback){
    redis.createClient(redis_db_name)
    .then(function(client){
        var key = getCacheKey(domain);
        client.smembers(key, function(err, results){
            callback(err, results);
            redis.release(redis_db_name, client);
        });
    })
    .catch(function(err){
        callback(err);
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
            redis.release(redis_db_name, client);
        });
    })
    .catch(function(err){
        callback(err);
        redis.release(redis_db_name, client);
    });
}

module.exports = {
    resolve4: resolve4,
    push: push
};
