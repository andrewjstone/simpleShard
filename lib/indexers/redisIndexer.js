var redis = require('redis');

var RedisIndexer = module.exports = function() {
  this.client = null;
  this.host = null;
  this.port = null;
  this.dbs = [];
}

RedisIndexer.id = 'redis';

RedisIndexer.prototype.connect = function(host, port, callback) {
  var client = redis.createClient(port, host);
  this.client = client;
  this.host = host;
  this.port = port;
  client.once('ready', function() {
    callback(null);
  });
};

RedisIndexer.prototype.empty = function(callback) {
  this.client.flushall(callback);
};

RedisIndexer.prototype.getNodeNames = function(callback) {
  this.client.smembers('nodes', callback);
};

RedisIndexer.prototype.getNode = function(nodeName, callback) {
  this.client.hgetall('node:'+nodeName, callback);
};

RedisIndexer.prototype.lookup = function(shardKey, callback) {
  this.client.get(shardKey, callback);
};

RedisIndexer.prototype.addShardKey = function(nodeName, shardKey, callback) {
  var self = this;
  this.client.set(shardKey, nodeName, callback);
};

RedisIndexer.prototype.addNode = function(nodeName, type, callback) {
  var self = this;
  this.client.multi()
   .sadd('nodes', nodeName)
   .hset('node:'+nodeName, 'type', type)
   .exec(callback);
};
