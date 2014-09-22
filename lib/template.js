var path = require('path'),
    fs = require('fs'),
    through = require('through2');

function template(opts) {
  var templateFile = fs.readFileSync(opts.file).toString();

  function replace(items, str) {
    var result = str;
    Object.keys(items).forEach(function(key) {
      result = result.replace(new RegExp('{{'+key+'}}', 'g'), items[key]);
    });
    return result;
  }

  return through.obj(function(file, enc, onDone) {
    var ext = path.extname(file.path);

    file.path = path.dirname(file.path) + '/' + path.basename(file.path, ext) + '.html';

    file.content = file.contents;

    file.contents =
        replace(file, templateFile)
        // allow {{}} via escaping
          .replace(/\\{/g, '{')
          .replace(/\\}/g, '}');

    delete file.content;
    this.push(file);
    onDone();
  });
}

module.exports = template;
