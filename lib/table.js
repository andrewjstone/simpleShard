var Table = require('cli-table');

var table = module.exports = {};

table.create = function(object) {
  if (Array.isArray(object)) return createMultiRowTable(object);
  createOneRowTable(object);
};

function createMultiRowTable(objects) {
  var header = createHeader(objects[0]);
  var table = new Table({
    head: header
  });
  objects.forEach(function(object) {
    table.push(createRow(header, object));
  });
  return table.toString();
}

function createOneRowTable(object) {
  var header = createHeader(object);
  var table = new Table({
    head: header
  });
  table.push(createRow(header, object));
  return table.toString();
}

function createHeader(object) {
  return Object.keys(object);
}

function createRow(header, object) {
  var row = [];
  for (var i = 0; i < header.length; i++) {
    row.push(String(object[header[i]]));
  }
  return row;
}
