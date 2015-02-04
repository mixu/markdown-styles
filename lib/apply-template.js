var fs = require('fs'),
    path = require('path'),
    glob = require('wildglob'),
    pi = require('pipe-iterators'),
    Handlebars = require('handlebars'),
    xtend = require('xtend');

function loadPartials(dir) {
  dir = path.normalize(dir);
  glob.sync(dir + '/*').filter(function(filename) {
    var stat = fs.statSync(filename);
    return stat.isFile();
  }).map(function(filename) {
    var partialName = path.basename(filename, path.extname(filename));
    Handlebars.registerPartial(partialName, fs.readFileSync(filename, 'utf8'));
  });
}

function loadHelpers(dir) {
  dir = path.normalize(dir);
  glob.sync(dir + '/*').filter(function(filename) {
    var stat = fs.statSync(filename);
    return stat.isFile();
  }).map(function(filename) {
      var helperName = path.basename(filename, path.extname(filename));
      Handlebars.registerHelper(helperName, require(filename));
  });
}

module.exports = function(opts) {
  if (opts.partials && !Array.isArray(opts.partials)) {
    opts.partials = [opts.partials];
  }
  if (!opts.partials) {
    opts.partials = [];
  }

  if (opts.helpers && !Array.isArray(opts.helpers)) {
    opts.helpers = [opts.helpers];
  }
  if (!opts.helpers) {
    opts.helpers = [];
  }

  loadPartials(__dirname + '/../builtin/partials');
  loadHelpers(__dirname + '/../builtin/helpers');

  // load partials and helpers
  opts.partials.map(loadPartials);
  opts.helpers.map(loadHelpers);

  var template = Handlebars.compile(opts.template);

  return pi.forEach(function(item, enc, done) {
    item.contents = item.contents.replace(/<(ul|ol)>/g, '<$1 class="list">')
      .replace('{{&gt;', '{{>')
      .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/mg, '<pre class="prettyprint">$1</pre>')
      .replace(/<p><img([^>]*)>\s*<\/p>/g, '<p class="img-container"><img$1></p>');

    // making the partial a function prevents handlebars from trying to parse
    // strings in the contents output, such as `{}` as HBS expressions
    Handlebars.registerPartial('content', function() { return item.contents; });

    item.contents = template(item)
        // allow {{}} via escaping
          .replace(/\\{/g, '{')
          .replace(/\\}/g, '}');
  });
};

