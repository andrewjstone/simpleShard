var repl = require('repl'),
    net = require('net');

exports.start = function() {
  net.createServer(function (socket) {
    repl.start('shards>', socket);
  }).listen(5001, '127.0.0.1');
};
