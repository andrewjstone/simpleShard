var repl = require('repl'),
    net = require('net'),
    inspect = require('util').inspect;

// Ansi Escape Sequences
var deleteLine = '\033[K';
var homeLine = '\033[100D';
var green = '\033[32m';
var resetGraphicsMode = '\033[0m';

exports.start = function(modules) {
  net.createServer(function (socket) {
    var replServer = repl.start('shards>', socket, null, true);
    addModules(replServer, modules);
    addUtilityFunctions(replServer, socket);
  }).listen(5001, '127.0.0.1');
};

function addModules(replServer, modules) {
  var context = replServer.context;
  Object.keys(modules).forEach(function(name) {
    var module = modules[name];
    context[name] = module;
  });
}

function addUtilityFunctions(replServer, stream) {
  var context = replServer.context;
  context.print = function(err, data) {
    if (err) {
      writeAsyncResult(stream, err);
    } else if (data) {
      writeAsyncResult(stream, data);
    } else { 
      writeOk(stream);
    }
    replServer.rli.prompt();
  }
}

function writeOk(stream) {
  removePrompt(stream);
  writeData(stream, green+'ok.\n'+resetGraphicsMode); 
}

function writeAsyncResult(stream, data) {
  removePrompt(stream);
  writeData(stream, inspect(data)+'\n');
}

function removePrompt(stream) {
  writeData(stream, homeLine+deleteLine);
}

function writeData(stream, data) {
  stream.write(data);
}
