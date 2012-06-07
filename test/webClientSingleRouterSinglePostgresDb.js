var assert = require('assert'),
    Router = require('../lib/router'),
    Client = require('../lib/client'),
    database = require('../lib/db'),
    uuid = require('node-uuid');

var router = null,
    client = null,
    port1 = 5454,
    shardKey = null,
    db = null,
    nodeName = '127.0.0.1:5432';

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
    client.addNode(nodeName, 'postgres', function(err, nodes) {
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
  it('create db', function() {
    db = database.create('postgres');
  });

  it('delete shard key table', function(done) {
    db.connect(function(err) {
      assertNotErr(err);
      db.deleteShardKeyTable(function(err, result) {
        assertNotErr(err);
        done();
      });
    });
  });

  it('create shard key table', function(done) {
    db.connect(function(err) {
      assertNotErr(err);
      db.createShardKeyTable(function(err, result) {
        assertNotErr(err);
        done();
      });
    });
  });
});

describe('Add a shard key to the node', function() {
  it('should add the key to the shardkeys table', function(done) {
    shardKey = uuid.v1();
    client.addShardKey(nodeName, shardKey, function(err) {
      assertNotErr(err);
      done();
    });
  });
});

describe('lookup a node by shard key', function() {
  it('returns the sole node', function(done) {
    client.lookup(shardKey, function(err, node) {
      assertNotErr(err);
      assert.equal(node, nodeName);
      done();
    });
  });
});

describe('lookup a node with an invalid shard key', function() {
  it('returns an error', function(done) {
    var badKey = uuid.v1();
    client.lookup(badKey, function(err, node) {
      assert(err);
      assert(!node);
      done();
    });
  });
});

describe('list shard keys objects', function() {
  it('returns the 1 key', function(done) {
    client.getShardKeys(function(err, keys) {
      assertNotErr(err);
      assert.equal(Object.keys(keys).length, 1);
      assert.equal(keys[shardKey], nodeName);
      done();
    });
  });
});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
