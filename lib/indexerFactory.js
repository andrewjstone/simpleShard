var indexerFactory = module.exports = {};
var indexers = indexerFactory.indexers = {};

indexerFactory.register = function(name, Indexer) {
  indexers[name] = Indexer;
};

indexerFactory.create = function(name) {
  var Indexer = indexers[name];
  return new Indexer(); 
};

