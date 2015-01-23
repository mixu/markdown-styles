var nodeResolve = require('resolve');

module.exports = function(name, paths) {
  var result = '', err;
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    try {
      result = nodeResolve.sync(name, { basedir: path });
    } catch (e) {
      err = e;
    }
    return result;
  }
  console.error('Cannot find module ' + name + ' from ' + paths);
  throw err;
};
