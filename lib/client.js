var request = require('request');

var Client = module.exports = function(uri) {
  this.uri = uri;
};

Client.prototype.getRouters = function(callback) {
  var uri = this.uri+'/routers';
  request(uri, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    var data = JSON.parse(body);
    return callback(null, data.routers);
  });
};

Client.prototype.addNode = function(name, type, callback) {
  var uri = this.uri+'/nodes';
  request({
    uri: uri,
    method: 'PUT',
    json: {name: name, type: type},
    timeout: 5000
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    return callback(null, body.nodes);
  });
};

Client.prototype.getNodes = function(callback) {
  var uri = this.uri+'/nodes';
  request(uri, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    var data = JSON.parse(body);
    return callback(null, data.nodes);
  });
};

Client.prototype.addShardKey = function(name, shardKey, callback) {
  var uri = this.uri+'/shardKeys';
  request({
    uri: uri,
    method: 'PUT',
    json: {name: name, shardKey: shardKey},
    timeout: 5000
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    return callback();
  });
};

Client.prototype.lookup = function(shardKey, callback) {
  var uri = this.uri+'/nodes?shardKey='+shardKey;
  request(uri, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    var data = JSON.parse(body);
    return callback(null, data.node);
  });
};

Client.prototype.getShardKeys = function(callback) {
  var uri = this.uri+'/shardKeys';
  request(uri, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback({code: res.statusCode, body: body}); 
    var data = JSON.parse(body);
    return callback(null, data.shardKeys);
  });
};

