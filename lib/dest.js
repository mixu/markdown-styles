var path = require('path'),
    fs = require('fs'),
    through = require('through2'),
    mkdirp = require('mkdirp');

// gulp's dest does too much, as the remapping from input to output is not optional
// whatever mapping is desired should be up to the user, not built into the file writing logic
function dest() {
  var seen = {};

  return through.obj(function (file, enc, onDone) {
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
