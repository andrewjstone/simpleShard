var pg = require('pg');

var db = module.exports = {};

// TODO use configuration from environment
db.connect = function(callback) {
  pg.connect('tcp://test:test@localhost/shardtest', callback);
};

db.deleteShardKeyTable = function(client, callback) {
  client.query('DROP TABLE shardkeys', callback);
};

db.createShardKeyTable = function(client, callback) {
  client.query('CREATE TABLE shardkeys(key uuid PRIMARY KEY)', callback);
};

db.addShardKey = function(client, shardKey, callback) {
  client.query('INSERT INTO shardkeys(key) values($1)', [shardKey], callback);
};
