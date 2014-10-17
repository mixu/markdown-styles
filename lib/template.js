var path = require('path'),
    fs = require('fs'),
    consolidate = require('consolidate'),
    through = require('through2'),
    _ = require('lodash');

function template(opts) {
  var templateFile = fs.readFileSync(opts.file).toString(),
      engine = opts.engine || 'handlebars';

  return through.obj(function(file, enc, onDone) {
    var self = this,
        ext = path.extname(file.path);

    // expected locals
    var locals = _.extend({ }, file);

    consolidate[engine].render(templateFile, locals, function(err, html) {
      if (!err) {
        file.path = path.dirname(file.path) + '/' + path.basename(file.path, ext) + '.html';
        file.contents = html;
        self.push(file);
      }
      onDone(err);
    });
  });
}

module.exports = template;
