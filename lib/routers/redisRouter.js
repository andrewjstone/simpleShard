var redis = require('redis'),
    dbFactory = require('../dbFactory');

var RedisRouter = module.exports = function() {
  this.indexer = null;
  this.indexerHost = null;
  this.indexerPort = null;
  this.dbs = [];
}

RedisRouter.id = 'redis';

RedisRouter.prototype.connectToIndexer = function(host, port, callback) {
  var indexer = redis.createClient(port, host);
  this.indexerHost = host;
  this.indexerPort = port;
  this.indexer = indexer;
  indexer.once('ready', function() {
    callback(null);
  });
};

RedisRouter.prototype.empty = function(callback) {
  this.indexer.flushall(callback);
};

RedisRouter.prototype.getNodeNames = function(callback) {
  this.indexer.smembers('nodes', callback);
};

RedisRouter.prototype.getNode = function(nodeName, callback) {
  this.indexer.hgetall('node:'+nodeName, callback);
};

RedisRouter.prototype.lookup = function(shardKey, callback) {
  this.indexer.get(shardKey, callback);
};

RedisRouter.prototype.addShardKey = function(nodeName, shardKey, callback) {
  var self = this;
  this.indexer.set(shardKey, nodeName, callback);
};

RedisRouter.prototype.addNode = function(nodeName, type, callback) {
  var self = this;
  this.indexer.multi()
   .sadd('nodes', nodeName)
   .hset('node:'+nodeName, 'type', type)
   .exec(callback);
};

RedisRouter.prototype.connectToDatabase = function(nodeName, type, callback) {
  if (this.dbs[nodeName]) return callback(new Error('Already Connected'));
  this.dbs[nodeName] = dbFactory.create(type);
  // TODO: make connect use nodeName
  this.dbs[nodeName].connect(callback);
};

RedisRouter.prototype.route = function(shardKey, query, callback) {
  var dbs = this.dbs;
  this.lookup(shardKey, function(err, nodeName) {
    if (err) return callback(err);
    if (!nodeName) return callback(new Error('Shard Key not found!'));
    dbs[nodeName].query(query, callback);
  });
};
