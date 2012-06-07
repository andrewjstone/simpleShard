var Memory = module.exports = function() {
  this.shardKeys = {};
};

Memory.prototype.connect = function(callback) {
  callback();
};

Memory.prototype.deleteShardKeyTable = function(callback) {
  this.shardKeys = {};
  callback();
};

Memory.prototype.createShardKeyTable = function(callback) {
  this.shardKeys = {};
  callback();
};

Memory.prototype.addShardKey = function(shardKey, callback) {
  if (this.shardKeys[shardKey]) return callback('That key already exists');
  this.shardKeys[shardKey] = true;
  callback();
};

