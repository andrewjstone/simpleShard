var assert = require('assert'),
    Router = require('../lib/router'),
    Client = require('../lib/client'),
    db = require('../lib/db'),
    uuid = require('node-uuid');

var router = null,
    client = null,
    port1 = 5454;

describe('create a router', function() {
  it('constructs successfully', function(done) {
    router = new Router('127.0.0.1', port1);
    setTimeout(done, 100);
  });
});

describe('create a client of the router', function() {
  it('constructs successfully', function() {
    client = new Client('http://127.0.0.1:'+port1);
  });
  
  it('successfully retrieves the router list', function(done) {
    client.getRouters(function(err, routers) {
      assertNotErr(err);
      assert.equal(routers.length, 1);
      done();
    });
  });
});

describe('Add node to a single router', function() {
  it('should add the nodes to the "nodes" list of the router', function(done) {
    client.addNode('127.0.0.1:5432', function(err, nodes) {
      assertNotErr(err);
      assert.equal(nodes.length, 1);
      done();
    });
  });

  it('the node should be retrievable', function(done) {
    client.getNodes(function(err, nodes) {
      assertNotErr(err);
      assert.equal(nodes.length, 1);
      done();
    });
  });
});

describe('Prepare Database', function() {
  var client = null;

  it('delete shard key table', function(done) {
    db.connect(function(err, _client) {
      assertNotErr(err);
      client = _client;
      db.deleteShardKeyTable(client, function(err, result) {
        assertNotErr(err);
        done();
      });
    });
  });

  it('create shard key table', function(done) {
    db.connect(function(err, client) {
      assertNotErr(err);
      db.createShardKeyTable(client, function(err, result) {
        assertNotErr(err);
        done();
      });
    });
  });
});

describe('Add a shard key to the node', function() {
  it('should add the key to the shardkeys table', function(done) {
    var shardKey = uuid.v1();
    client.addShardKey('127.0.0.1:5432', shardKey, function(err) {
      assertNotErr(err);
      done();
    });
  });
});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
