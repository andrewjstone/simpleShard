var indexerFactory = require('../lib/indexerFactory'),
    dbFactory = require('../lib/dbFactory'),
    assert = require('assert'),
    uuid = require('node-uuid'),
    Router = require('../lib/router');

var PostgresDb = require('../lib/databases/postgresDb'),
    RedisIndexer = require('../lib/indexers/redisIndexer'),
    redisIndexer = null,
    ip = '127.0.0.1', 
    port = 6379,
    uuid1 = uuid.v1(),
    node1 = '127.0.0.1:5432',
    router = new Router();

describe('setup', function() {
  it('register a postgres db', function() {
    assert.doesNotThrow(
      function() {
        dbFactory.register('postgres', PostgresDb);
      }
    );
  });
  it('register a redis indexer', function() {
    assert.doesNotThrow(
      function() {
        indexerFactory.register('redis', RedisIndexer);
      }
    );
  });
});

describe('API', function() {
  it('connect to indexer from router', function(done) {
    router.connectToIndexer(ip, port, 'redis', function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('empty the indexer', function(done) {
    router.empty(function(err) {
      assertNotErr(err);
      done();
    });
  });


  it('add Node', function(done) {
    router.addNode(node1, 'memory', function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('get nodeNames', function(done) {
    router.getNodeNames(function(err, nodes) {
      assertNotErr(err);
      assert.equal(nodes.length, 1);
      done();
    });
  });

  it('get node', function(done) {
    router.getNode(node1, function(err, node) {
      assertNotErr(err);
      assert.equal(node.type, 'memory');
      done();
    });
  });

  it('add shard key', function(done) {
    router.addShardKey(node1, uuid1, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('lookup node based on shard key', function(done) {
    router.lookup(uuid1, function(err, node) {
      assertNotErr(err);
      assert.equal(node, node1);
      done();
    });
  });

  it('connect to node', function(done) {
    router.connectToDatabase(node1, 'postgres', function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('route a postgres sql query', function(done) {
    router.route(uuid1, 'SELECT * FROM pg_stat_activity', function(err, response) {
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
