var PostgresDb = require('./postgresDb');
var db = module.exports = {};

db.create = function(type) {
  if (type === 'postgres') {
    return new PostgresDb();
  }
};

