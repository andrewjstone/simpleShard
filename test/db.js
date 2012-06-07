var db = require('../lib/db.js'),
    assert = require('assert'),
    uuid = require('node-uuid');

var client = null;

describe('API', function() {
  it('db.connect(callback)', function(done) {
    db.connect(function(err, _client) {
      assertNotErr(err);
      client = _client;
      assert(client);
      done();
    });
  });

  it('db.deleteShardKeyTable(client, callback)', function(done) {
    db.deleteShardKeyTable(client, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('db.createShardKeyTable(client, callback)', function(done) {
    db.createShardKeyTable(client, function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('db.addShardKey(client, callback)', function(done) {
    var shardKey = uuid.v1();
    db.addShardKey(client, shardKey, function(err) {
      assertNotErr(err);
      done();
    });
  });
});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
