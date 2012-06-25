var repl = require('./lib/repl'),
    indexerFactory = require('./lib/indexerFactory'),
    dbFactory= require('./lib/dbFactory'),
    fs = require('fs'),
    repl = require('./lib/repl');

exports.indexerFactory = indexerFactory;
exports.dbFactory = dbFactory;
exports.repl = repl;

main(); 

function main() {
  registerDatabases();
  registerIndexers();
  startRepl();
}

function startRepl() {
  repl.start(exports);
}

function registerDatabases() {
  var dir = __dirname+'/lib/databases';
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    if (file.match(/.swp$/)) return;
    var _module  = require(dir+'/'+file);
    dbFactory.register(_module.id, _module);
  });
}

function registerIndexers() {
  var dir = __dirname+'/lib/indexers';
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    if (file.match(/.swp$/)) return;
    var _module  = require(dir+'/'+file);
    indexerFactory.register(_module.id, _module);
  });
}

