var repl = require('./lib/repl'),
    routerFactory = require('./lib/routerFactory'),
    databaseFactory = require('./lib/dbFactory'),
    fs = require('fs'),
    repl = require('./lib/repl');

exports.routerFactory = routerFactory;
exports.databaseFactory = databaseFactory;
exports.repl = repl;

main(); 

function main() {
  registerDatabases();
  registerRouters();
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
    databaseFactory.register(_module.id, _module);
  });
}

function registerRouters() {
  var dir = __dirname+'/lib/routers';
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    if (file.match(/.swp$/)) return;
    var _module  = require(dir+'/'+file);
    routerFactory.register(_module.id, _module);
  });
}

