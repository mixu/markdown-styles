var fs = require('fs'),
    path = require('path'),
    glob = require('wildglob'),
    pi = require('pipe-iterators'),
    xtend = require('xtend');


module.exports = function(opts) {
  return pi.forEach(function(item, enc, done) {
    item.contents = JSON.stringify(item, null, 2);
  });
};

