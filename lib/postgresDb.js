var pg = require('pg');

var Postgres = module.exports = function() {
};

// TODO use configuration from environment
Postgres.prototype.connect = function(callback) {
  var self = this;
  pg.connect('tcp://test:test@localhost/shardtest', function(err, client) {
    if (err) return callback(err);
    self.client = client;
    return callback();
  });
};

Postgres.prototype.deleteShardKeyTable = function(callback) {
  this.client.query('DROP TABLE shardkeys', callback);
};

Postgres.prototype.createShardKeyTable = function(callback) {
  this.client.query('CREATE TABLE shardkeys(key uuid PRIMARY KEY)', callback);
};

Postgres.prototype.addShardKey = function(shardKey, callback) {
  this.client.query('INSERT INTO shardkeys(key) values($1)', [shardKey], callback);
};
