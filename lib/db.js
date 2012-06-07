var PostgresDb = require('./postgresDb'),
    MemoryDb = require('./memoryDb');

var db = module.exports = {};

db.create = function(type) {
  if (type === 'postgres') {
    return new PostgresDb();
  }

  if (type === 'memory') {
    return new MemoryDb();
  }
};

