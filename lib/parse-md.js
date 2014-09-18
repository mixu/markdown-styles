var through = require('through2'),
    marked = require('marked');

function parseMd() {
  return through.obj(function(file, enc, onDone) {
    file.contents = marked.lexer(file.contents.toString());
    // push to next transform
    this.push(file);
    onDone();
  });
}

module.exports = parseMd;
