var http = require('http'),
    parseUrl = require('url').parse;

var server = module.exports = {};

server.create = function(router, host, port) {
  return http.createServer(function(req, res) {
    handleRequest(router, req, res);
  }).listen(port, host, function(err) {
    console.log('Router running at http://'+host+':'+port);
  });
};

function handleRequest(router, req, res) {
  var parsed = parseUrl(req.url, true);

  if (parsed.pathname === '/routers' && req.method === 'GET') {
    return getRouters(router, req, res);
  }

  if (parsed.pathname === '/nodes' && req.method === 'GET') {
    return getNodes(router, req, res, parsed);
  }

  if (parsed.pathname === '/nodes' && req.method === 'PUT') {
    return addNode(router, req, res);
  }

  if (parsed.pathname === '/shardKey' && req.method === 'PUT') {
    return addShardKey(router, req, res);
  }
  
  res.statusCode = 404;
  res.end();
}

function getRouters(router, req, res) {
  res.end(JSON.stringify({routers: router.getRouters()}));
}

function getNodes(router, req, res, parsedReq) {
  if (parsedReq.query.shardKey) {
    var node = router.lookup(parsedReq.query.shardKey);
    if (!node) {
      res.statusCode = 404;
      res.end('The shardKey '+parsedReq.query.shardKey+' cannot be found');
    }
    return res.end(JSON.stringify({node: node}));
  }
  var nodes = router.getNodes();
  res.end(JSON.stringify({nodes: Object.keys(nodes)}));
}

function addShardKey(router, req, res) {
  getBody(req, function(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end(err);
    }
    if (!router.isNode(body.name)) {
      res.statusCode = 404;
      return res.end('The node requested: '+body.name+' does not exist');
    }
    router.addShardKey(body.name, body.shardKey, function(err) {
      if (err) {
        res.statusCode = 500;
        return res.end(err);
      }
      res.end();
    });
  });
}

function addNode(router, req, res) {
  getBody(req, function(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end(err);
    }
    var name = body.name;
    router.addNode(name, function(err, nodes) {
      if (err) {
        res.statusCode = 500;
        return res.end(err);
      }
      res.end(JSON.stringify({nodes: Object.keys(nodes)}));
    });
  });
}

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
