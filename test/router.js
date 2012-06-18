var routerFactory = require('../lib/routerFactory'),
    dbFactory = require('../lib/dbFactory'),
    assert = require('assert'),
    uuid = require('node-uuid');

var RedisRouter = require('../lib/routers/redisRouter'),
    PostgresDb = require('../lib/databases/postgresDb'),
    redisRouter = null,
    ip = '127.0.0.1', 
    port = 6379,
    uuid1 = uuid.v1(),
    node1 = '127.0.0.1:5432';

describe('setup', function() {
  it('register a postgres db', function() {
    dbFactory.register('postgres', PostgresDb);
  });
});

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

  it('connect to a redis indexer', function(done) {
    redisRouter.connectToIndexer(ip, port, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('empty the indexer', function(done) {
    redisRouter.empty(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('add Node', function(done) {
    redisRouter.addNode(node1, 'memory', function(err) {
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
    redisRouter.getNode(node1, function(err, node) {
      assertNotErr(err);
      assert.equal(node.type, 'memory');
      done();
    });
  });

  it('add shard key', function(done) {
    redisRouter.addShardKey(node1, uuid1, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('lookup node based on shard key', function(done) {
    redisRouter.lookup(uuid1, function(err, node) {
      assertNotErr(err);
      assert.equal(node, node1);
      done();
    });
  });

  it('connect to node', function(done) {
    redisRouter.connectToDatabase(node1, 'postgres', function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('route a postgres sql query', function(done) {
    redisRouter.route(uuid1, 'SELECT * FROM pg_stat_activity', function(err, response) {
      assertNotErr(err);
      assert(response);
      done();
    });
  });

});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
