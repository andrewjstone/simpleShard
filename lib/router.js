var http = require('http'),
    parseUrl = require('url').parse,
    db = require('./db'); 

var Router = module.exports = function(host, port) {
  this.host = host;
  this.port = port;
  this.routers = ['http://'+host+':'+port];
  this.nodes = {};
  this.names = {};
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
    return this.getNodes(req, res, parsed);
  }

  if (parsed.pathname === '/nodes' && req.method === 'PUT') {
    return this.addNode(req, res);
  }

  if (parsed.pathname === '/shardKey' && req.method === 'PUT') {
    return this.addShardKey(req, res);
  }
  
  res.statusCode = 404;
  res.end();
};

Router.prototype.getRouters = function(req, res) {
  res.end(JSON.stringify({routers: this.routers}));
};

Router.prototype.getNodes = function(req, res, parsedReq) {
  if (parsedReq.query.shardKey) {
    var node = this.names[parsedReq.query.shardKey];
    if (!node) {
      res.statusCode = 404;
      res.end('The shardKey '+parsedReq.query.shardKey+' cannot be found');
    }
    return res.end(JSON.stringify({node: node}));
  }
  res.end(JSON.stringify({nodes: Object.keys(this.nodes)}));
};

Router.prototype.addShardKey = function(req, res) {
  var self = this;
  getBody(req, function(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end(err);
    }
    if (!self.nodes[body.name]) {
      res.statusCode = 404;
      return res.end('The node requested: '+body.name+' does not exist');
    }
    var client = self.nodes[body.name].db;
    var shardKey = body.shardKey;
    db.addShardKey(client, shardKey, function(err) {
      if (err) {
        res.statusCode = 500;
        return res.end(err);
      }
      self.names[shardKey] = body.name;
      res.end();
    });
  });
};

Router.prototype.addNode = function(req, res) {
  var self = this;
  getBody(req, function(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end(err);
    }
    var name = body.name;
    if (!self.nodes[name]) {
      return db.connect(function(err, client) {
        if (err) {
          res.statusCode = 500;
          return res.end(err);
        }
        self.nodes[name] = {db: client};
        res.end(JSON.stringify({nodes: Object.keys(self.nodes)}));
      });
    }
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
