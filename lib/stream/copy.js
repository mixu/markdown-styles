var fs = require('fs'),
    path = require('path'),
    pi = require('pipe-iterators');

module.exports = function(targetFn) {
  var seen = {};
  return pi.thru.obj(function(filename, enc, onDone) {
    var target = targetFn(filename);
    // skip by returning false
    if (!target) { return onDone(); }

    var copyDir = path.dirname(target);

    var task = function () {
      fs.createReadStream(filename)
        .pipe(fs.createWriteStream(target))
        .once('finish', function() {
          onDone();
        })
        .once('error', onDone);
    }

    if (seen[copyDir]) {
      return task();
    }

    fs.mkdir(copyDir, {recursive: true}, function(err) {
      // We will just eat EEXIST errors - we aren't checking if
      // the directory exists before attempting to create it so these are expected.
      if (err && err.code !== 'EEXIST') {
        return onDone(err);
      }
      seen[copyDir] = true;
      task();
    });
  });
};
