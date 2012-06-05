var assert = require('assert'),
    Router = require('../lib/router'),
    Client = require('../lib/client');

var router = null,
    client = null,
    port1 = 5454;

describe('create a router', function() {
  it('constructs successfully', function(done) {
    router = new Router('127.0.0.1', port1);
    setTimeout(done, 100);
  });
});

describe('create a client of the router', function() {
  it('constructs successfully', function() {
    client = new Client('http://127.0.0.1:'+port1);
  });
  
  it('successfully retrieves the router list', function(done) {
    client.getRouters(function(err, routers) {
      assert.ok(!err);
      assert.equal(routers.length, 1);
      done();
    });
  });
});

describe('Add node to a single router', function() {
  it('should add the nodes to the "nodes" list of the router', function(done) {
    client.addNode('127.0.0.1:5432', function(err, nodes) {
      assert.ok(!err);
      assert.equal(Object.keys(nodes).length, 1);
      done();
    });
  });

  it('the node should be retrievable', function(done) {
    client.getNodes(function(err, nodes) {
      assert.ok(!err);
      assert.equal(Object.keys(nodes).length, 1);
      done();
    });

  });
});
