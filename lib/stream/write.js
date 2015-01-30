var path = require('path'),
    fs = require('fs'),
    pi = require('pipe-iterators'),
    mkdirp = require('mkdirp');

function dest() {
  var seen = {};

  return pi.thru.obj(function(file, enc, onDone) {
    var writeDir = path.dirname(file.path);

    (seen[writeDir] ? function(a, onDone) { onDone(null); } : mkdirp)(
      writeDir, function(err) {
        if (err) {
          return onDone(err);
        }
        seen[writeDir] = true;
        fs.writeFileSync(file.path, file.contents);
        onDone();
      }
    );
  });
}

module.exports = dest;
