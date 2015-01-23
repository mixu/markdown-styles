var fs = require('fs'),
    pi = require('pipe-iterators');

function read() {
  return pi.thru.obj(function(file, enc, onDone) {
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
