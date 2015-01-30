var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    pi = require('pipe-iterators');

module.exports = function(targetFn) {
  var seen = {};
  return pi.thru.obj(function(filename, enc, done) {
    var target = targetFn(filename);
    // skip by returning false
    if (!target) { return done(); }

    var copyDir = path.dirname(target);
    (seen[copyDir] ? function(a, onDone) { onDone(null); } : mkdirp)(
      copyDir, function(err) {
        if (err) {
          throw err;
        }
        seen[copyDir] = true;
        fs.createReadStream(filename)
          .pipe(fs.createWriteStream(target))
          .once('finish', function() {
            done();
          })
          .once('error', done);
      });
  });
};
