var redis = require('redis'),
    dbFactory = require('./dbFactory'),
    indexerFactory = require('./indexerFactory');

var Router = module.exports = function() {
  this.indexer = null;
  this.dbs = [];
}

Router.prototype.empty = function(callback) {
  this.indexer.empty(callback);
};

Router.prototype.getNodeNames = function(callback) {
  this.indexer.getNodeNames(callback);
};

Router.prototype.getNode = function(nodeName, callback) {
  this.indexer.getNode(nodeName, callback);
};

Router.prototype.lookup = function(shardKey, callback) {
  this.indexer.lookup(shardKey, callback);
};

Router.prototype.addShardKey = function(nodeName, shardKey, callback) {
  this.indexer.addShardKey(nodeName, shardKey, callback);
};

Router.prototype.addNode = function(nodeName, type, callback) {
  this.indexer.addNode(nodeName, type, callback);
};

Router.prototype.connectToIndexer = function(host, port, type, callback) {
  if (this.indexer) return callback(new Error('Already Connected to Indexer'));
  this.indexer = indexerFactory.create(type);
  this.indexer.connect(host, port, callback);
};

Router.prototype.connectToDatabase = function(nodeName, type, callback) {
  if (this.dbs[nodeName]) return callback(new Error('Already Connected to Database'));
  this.dbs[nodeName] = dbFactory.create(type);
  // TODO: make connect use nodeName
  this.dbs[nodeName].connect(callback);
};

Router.prototype.route = function(shardKey, query, callback) {
  var dbs = this.dbs;
  this.lookup(shardKey, function(err, nodeName) {
    if (err) return callback(err);
    if (!nodeName) return callback(new Error('Shard Key not found!'));
    dbs[nodeName].query(query, callback);
  });
};
