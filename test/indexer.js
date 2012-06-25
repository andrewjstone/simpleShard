var indexerFactory = require('../lib/indexerFactory'),
    assert = require('assert'),
    uuid = require('node-uuid');

var RedisIndexer = require('../lib/indexers/redisIndexer'),
    indexer = null;
    ip = '127.0.0.1',
    port = 6379,
    uuid1 = uuid.v1(),
    node1 = '127.0.0.1:5432';

describe('API', function() {
  it('register a redis indexer', function() {
    assert.doesNotThrow(
      function() {
        indexerFactory.register('redis', RedisIndexer);
      }
    );
  });

  it('create the indexer', function() {
    indexer = indexerFactory.create('redis');
    assert(indexer);
  });

  it('connect to the indexer', function(done) {
    indexer.connect(ip, port, function(err) {
      assert(!err);
      done();
    });
  });

  it('empty the indexer', function(done) {
    indexer.empty(function(err) {
      assert(!err);
      done();
    });
  });

  it('add Node', function(done) {
    indexer.addNode(node1, 'memory', function(err) {
      assert(!err);
      done();
    });
  });

  it('get node names', function(done) {
    indexer.getNodeNames(function(err, nodes) {
      assert(!err);
      assert.equal(nodes.length, 1);
      done();
    });
  });

  it('get node', function(done) {
    indexer.getNode(node1, function(err, node) {
      assert.equal(node.type, 'memory');
      done();
    });
  });

  it('add shard key', function(done) {
    indexer.addShardKey(node1, uuid1, function(err) {
      assert(!err);
      done();
    });
  });
});
