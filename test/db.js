var dbFactory = require('../lib/dbFactory'),
    assert = require('assert'),
    uuid = require('node-uuid'),
    table = require('../lib/table');

// Different Backends
var PostgresDb = require('../lib/databases/postgresDb'),
    MemoryDb = require('../lib/databases/memoryDb');

var postgresDb = null,
    memoryDb = null;

describe('API', function() {
  it('register a postgres db', function() {
    assert.doesNotThrow(
      function() {
        dbFactory.register('postgres', PostgresDb);
      }
    );
  });

  it('register a memory db', function() {
    assert.doesNotThrow(
      function() {
        dbFactory.register('memory', MemoryDb);
      }
    );
  });

  it('create a postgres db', function() {
    assert.doesNotThrow(
      function() {
        postgresDb = dbFactory.create('postgres'); 
      }
    );
  });

  it('create a memory db', function() {
    assert.doesNotThrow(
      function() {
        memoryDb = dbFactory.create('memory'); 
      }
    );
  });

  it('connect to a postgres db', function(done) {
    postgresDb.connect(function(err) {
      assertNotErr(err);
      done();
    });
  });

  it('connect to a memory db', function(done) {
    memoryDb.connect(function(err) {
      assertNotErr(err);
      done();
    });
  });

  describe('get status', function() {
    it('database', function(done) {
      postgresDb.getStatusDatabase(function(err, status) {
        assertNotErr(err);
        assert(status);
        done();
      });
    });

    it('tables', function(done) {
      postgresDb.getStatusTables(function(err, status) {
        assertNotErr(err);
        assert(status);
        done();
      });
    });
  });

  it('query the database', function(done) {
    var query = 'SELECT * FROM pg_stat_user_tables';
    postgresDb.query(query, function(err, data) {
      assertNotErr(err);
      assert(data);
      done();
    });
  });

});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
