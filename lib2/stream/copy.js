var pi = require('pipe-iterators');

module.exports = function(targetFn) {
  var seen = {};
  return pi.thru.obj(function(filename, enc, done) {
    var target = targetFn(filename),
        copyDir = path.dirname(target);
    (seen[copyDir] ? function(a, onDone) { onDone(null); } : mkdirp)(
      copyDir, function(err) {
        if (err) {
          throw err;
        }
        seen[copyDir] = true;
        fs.createReadStream(filename)
          .pipe(fs.createWriteStream(target))
          .once('finish', done)
          .once('error', done);
      });
  });
}
