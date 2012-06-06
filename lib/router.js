var db = require('./db'),
    server = require('./routeServer');

var Router = module.exports = function(host, port) {
  this.host = host;
  this.port = port;
  this.routers = ['http://'+host+':'+port];
  this.nodes = {};
  this.names = {};
  this.server = server.create(this, host, port);
}

Router.prototype.getRouters = function(req, res) {
  return this.routers;
};

Router.prototype.getNodes = function() {
  return this.nodes;
};

Router.prototype.lookup = function(shardKey) {
  return this.names[shardKey];
};

Router.prototype.isNode = function(nodeName) {
  return this.nodes[nodeName] ? true : false;
};

Router.prototype.addShardKey = function(nodeName, shardKey, callback) {
  var self = this;
  var client = self.nodes[nodeName].db;
  db.addShardKey(client, shardKey, function(err) {
    if (err) return callback(err);
    self.names[shardKey] = nodeName;
    return callback();
  });
};

Router.prototype.addNode = function(nodeName, callback) {
  var self = this;
  if (this.nodes[nodeName]) return callback('Node already exists');
  db.connect(function(err, client) {
    if (err) return callback(err);
    self.nodes[nodeName] = {db: client};
    callback(null, self.nodes);
  });
};

