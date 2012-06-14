var redis = require('redis');

var RedisRouter = module.exports = function() {
  this.client = null;
  this.clientHost = null;
  this.clientPort = null;
}

RedisRouter.prototype.connect = function(host, port, callback) {
  var client = redis.createClient(port, host);
  this.clientHost = host;
  this.clientPort = port;
  this.client = client;
  client.once('ready', function() {
    callback(null);
  });
};

RedisRouter.prototype.empty = function(callback) {
  this.client.flushall(callback);
};

RedisRouter.prototype.getNodeNames = function(callback) {
  this.client.smembers('nodes', callback);
};

RedisRouter.prototype.getNode = function(nodeName, callback) {
  this.client.hgetall('node:'+nodeName, callback);
};

RedisRouter.prototype.lookup = function(shardKey, callback) {
  this.client.get(shardKey, callback);
};

RedisRouter.prototype.addShardKey = function(nodeName, shardKey, callback) {
  var self = this;
  this.client.set(shardKey, nodeName, callback);
};

RedisRouter.prototype.addNode = function(nodeName, type, callback) {
  var self = this;
  this.client.multi()
   .sadd('nodes', nodeName)
   .hset('node:'+nodeName, 'type', type)
   .exec(callback);
};

