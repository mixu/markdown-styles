var fs = require('fs'),
    util = require('util'),
    path = require('path');

module.exports = function(list) {
  function traverse(folder, currentPath) {
    if(folder['.']) {
      console.log(currentPath);
      console.log(folder['.']);
    }
    Object.keys(folder).forEach(function(dirname) {
      if( dirname != '.') {
        traverse(folder[dirname], currentPath + dirname + '/');
      }
    });
  }
  traverse(list.structured, '/');
};
