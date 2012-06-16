var repl = require('repl'),
    net = require('net');

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
    if (err) return stream.write(err);
    if (data) stream.write(data+'\n');
  }
}

