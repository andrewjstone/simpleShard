var assert = require('assert'),
    Router = require('../lib/router'),
    database = require('../lib/db'),
    uuid = require('node-uuid'),
    async = require('async');

var router = null,
    client = null,
    port1 = 5454,
    shardKey = null,
    db = null;

describe('create a router', function() {
  it('constructs successfully', function(done) {
    router = new Router('127.0.0.1', port1);
    setTimeout(done, 100);
  });
});

describe('add 10 memory nodes', function() {
  it('succeeds', function(done) {
    async.forEach(['1','2','3','4','5','6','7','8','9','10'], function(name, cb) {
      router.addNode(name, 'memory', cb);
    }, function(err) {
      assertNotErr(err);
      done();
    });
  }); 

  it('10 nodes got added', function() {
    assert.equal(Object.keys(router.getNodes()).length, 10);
  });
});

describe('add a shard key to each node', function() {
  it('succeeds', function(done) {
    async.forEach(Object.keys(router.getNodes()), function(nodeName, cb) {
      var shardKey = uuid.v1();
      router.addShardKey(nodeName, shardKey, cb);
    }, function(err) {
      assertNotErr(err);
      done();
    });
  });
});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
