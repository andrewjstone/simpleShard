var assert = require('assert'),
    uuid = require('node-uuid'),
    async = require('async'),
    routerFactory = require('../lib/routerFactory.js');


var RedisRouter = require('../lib/redisRouter'),
    router = null,
    ip = '127.0.0.1', 
    port = 6379,
    uuid1 = uuid.v1();

describe('setup a redis router', function() {
  it('register a redis router', function() {
    assert.doesNotThrow(
      function() {
        routerFactory.register('redis', RedisRouter);
      }
    );
  });

  it('create a redis router', function() {
    assert.doesNotThrow(
      function() {
        router = routerFactory.create('redis'); 
      }
    );
  });

  it('connect to a redis router', function(done) {
    router.connect(ip, port, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('empty', function(done) {
    router.empty(function(err) {
      assertNotErr(err);
      done();
    });
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

  it('10 nodes got added', function(done) {
    router.getNodeNames(function(err, nodes) {
      assertNotErr(err);
      assert.equal(nodes.length, 10);
      done();
    });
  });
});

describe('add a shard key to each node', function() {
  it('succeeds', function(done) {
    async.forEach(router.getNodeNames, function(nodeName, cb) {
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
