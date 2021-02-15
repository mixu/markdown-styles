var path = require('path'),
    fs = require('fs'),
    pi = require('pipe-iterators');

function dest() {
  var seen = {};

  return pi.thru.obj(function(file, enc, onDone) {
    var writeDir = path.dirname(file.path);

    var task = function() {
      fs.writeFileSync(file.path, file.contents);
      onDone();
    }

    if (seen[writeDir]) {
      return task();
    }

    fs.mkdir(writeDir, {recursive: true}, function(err) {
      // We will just eat EEXIST errors - we aren't checking if
      // the directory exists before attempting to create it so these are expected.
      if (err && err.code !== 'EEXIST') {
        return onDone(err);
      }
      seen[writeDir] = true;
      task();
    });
  });
}

module.exports = dest;
