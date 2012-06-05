var http = require('http'),
    parseUrl = require('url').parse;
    
var Router = module.exports = function(host, port) {
  this.host = host;
  this.port = port;
  this.routers = ['http://'+host+':'+port];
  this.nodes = {};
  var self = this;
  this.server = http.createServer(function(req, res) {
    self.handleRequest(req, res);
  }).listen(port, host, function(err) {
    console.log('Router running at http://'+host+':'+port);
  });
};

Router.prototype.handleRequest = function(req, res) {
  var parsed = parseUrl(req.url, true);

  if (parsed.pathname === '/routers' && req.method === 'GET') {
    return this.getRouters(req, res);
  }

  if (parsed.pathname === '/nodes' && req.method === 'GET') {
    return this.getNodes(req, res);
  }

  if (parsed.pathname === '/nodes' && req.method === 'PUT') {
    return this.addNode(req, res);
  }
  
  res.statusCode = 404;
  res.end();
};

Router.prototype.getRouters = function(req, res) {
  res.end(JSON.stringify({routers: this.routers}));
};

Router.prototype.getNodes = function(req, res) {
  res.end(JSON.stringify({nodes: this.nodes}));
};

Router.prototype.addNode = function(req, res) {
  var self = this;
  getBody(req, function(err, body) {
    if (err) {
      res.statusCode = 500;
      res.end(err);
    }
    var name = body.name;
    if (!self.nodes[name]) self.nodes[name] = {};
    res.end(JSON.stringify({nodes: self.nodes}));
  });
};

function getBody(req, callback) {
  var body = '';
  var done = false;
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    if (!done) return callback(null, JSON.parse(body));
  });
  req.on('error', function(err) {
    err = 'Failed to retrieve body for'+req.url+':'+err;
    console.error(err);
    return callback(err);
  });
};
