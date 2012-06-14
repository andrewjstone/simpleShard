var routerFactory = module.exports = {};
var routers = routerFactory.routers = {};

routerFactory.register = function(name, Router) {
  routers[name] = Router;
};

routerFactory.create = function(name) {
  var Router = routers[name];
  return new Router(); 
};

