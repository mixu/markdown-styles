var through = require('through2');

module.exports = function() {
  return through.obj(function annotateMarkdownHeadings(file, enc, onDone) {
      // file content is lexer output
      file.headings = file.contents.filter(function(token) {
        return token.type == 'heading';
      }).map(function(token) {
        token.id = token.text.toLowerCase().replace(/[^a-z0-9]/g, '_');
        return token;
      });
      this.push(file);
      onDone();
  });
};
