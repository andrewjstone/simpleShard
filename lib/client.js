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

Client.prototype.addNode = function(name, callback) {
  var uri = this.uri+'/nodes';
  request({
    uri: uri,
    method: 'PUT',
    json: {name: name},
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
