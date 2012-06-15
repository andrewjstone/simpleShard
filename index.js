var repl = require('./lib/repl'),
    routerFactory = require('./lib/routerFactory'),
    databaseFactory = require('./lib/dbFactory'),
    fs = require('fs');

main(); 

function main() {
  registerDatabases();
  registerRouters();
  startRepl();
}

function startRepl() {
  repl.start();
}

function registerDatabases() {
  var dir = __dirname+'/lib/databases';
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var _module  = require(dir+'/'+file);
    databaseFactory.register(_module.name, module);
  });
}

function registerRouters() {
  var dir = __dirname+'/lib/routers';
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var _module  = require(dir+'/'+file);
    routerFactory.register(_module.name, module);
  });
}

