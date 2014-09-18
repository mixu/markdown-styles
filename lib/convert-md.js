var through = require('through2'),
    marked = require('marked');

function convertMd() {
  return through.obj(function(file, enc, onDone) {
    file.contents = marked.parser(file.contents);
    // push to next transform
    this.push(file);
    onDone();
  });
}

module.exports = convertMd;
