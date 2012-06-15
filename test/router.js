var routerFactory = require('../lib/routerFactory.js'),
    assert = require('assert'),
    uuid = require('node-uuid');

var RedisRouter = require('../lib/routers/redisRouter'),
    redisRouter = null,
    ip = '127.0.0.1', 
    port = 6379,
    uuid1 = uuid.v1();

describe('API', function() {
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
        redisRouter = routerFactory.create('redis'); 
      }
    );
  });

  it('connect to a redis router', function(done) {
    redisRouter.connect(ip, port, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('empty the router', function(done) {
    redisRouter.empty(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('add Node', function(done) {
    redisRouter.addNode('node1', 'memory', function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('get nodeNames', function(done) {
    redisRouter.getNodeNames(function(err, nodes) {
      assertNotErr(err);
      assert.equal(nodes.length, 1);
      done();
    });
  });

  it('get node', function(done) {
    redisRouter.getNode('node1', function(err, node) {
      assertNotErr(err);
      assert.equal(node.type, 'memory');
      done();
    });
  });

  it('add shard key', function(done) {
    redisRouter.addShardKey('node1', uuid1, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('lookup node based on shard key', function(done) {
    redisRouter.lookup(uuid1, function(err, node) {
      assertNotErr(err);
      assert.equal(node, 'node1');
      done();
    });
  });


});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
