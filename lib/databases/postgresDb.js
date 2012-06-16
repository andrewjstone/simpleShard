var pg = require('pg');

var Postgres = module.exports = function() {
};

Postgres.id = 'postgres';

// TODO use configuration from environment
Postgres.prototype.connect = function(callback) {
  var self = this;
  pg.connect('tcp://test:test@localhost/shardtest', function(err, client) {
    if (err) return callback(err);
    self.client = client;
    return callback();
  });
};

Postgres.prototype.getStatusDatabase = function(callback) {
  this.client.query('SELECT * FROM pg_stat_database', callback);
};

Postgres.prototype.getStatusTables = function(callback) {
  this.client.query('SELECT * FROM pg_stat_user_tables', callback);
};

Postgres.prototype.query = function(query, callback) {
  this.client.query(query, callback);
};
