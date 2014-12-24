var fs = require('fs'),
    through = require('through2');

function read() {
  return through.obj(function(file, enc, onDone) {
    var stat = fs.statSync(file);
    if (stat.isFile()) {
      this.push({
        path: file,
        stat: stat,
        contents: fs.readFileSync(file).toString()
      });
    }
    onDone();
  });
}

module.exports = read;
