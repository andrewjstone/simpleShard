var dbFactory = module.exports = {};
var dbs = dbFactory.dbs = {};

dbFactory.register = function(name, Db) {
  dbs[name] = Db;
};

dbFactory.create = function(name) {
  var Db = dbs[name];
  return new Db(); 
};

