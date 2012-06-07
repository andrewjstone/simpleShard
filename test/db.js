var database = require('../lib/db.js'),
    assert = require('assert'),
    uuid = require('node-uuid');

var db = null;

describe('API', function() {
  it('new Db()', function() {
    db = database.create('postgres'); 
    assert(db);
  });

  it('db.connect(callback)', function(done) {
    db.connect(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('db.deleteShardKeyTable(callback)', function(done) {
    db.deleteShardKeyTable(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('db.createShardKeyTable(client, callback)', function(done) {
    db.createShardKeyTable(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('db.addShardKey(client, callback)', function(done) {
    var shardKey = uuid.v1();
    db.addShardKey(shardKey, function(err) {
      assertNotErr(err);
      done();
    });
  });
});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
