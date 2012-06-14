var dbFactory = require('../lib/dbFactory.js'),
    assert = require('assert'),
    uuid = require('node-uuid');

// Different Backends
var PostgresDb = require('../lib/postgresDb'),
    MemoryDb = require('../lib/memoryDb');

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

});

function assertNotErr(err) {
  if (err) console.error(err);
  assert(!err);
}
