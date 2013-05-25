var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp,
    convertMarkdown = require('./file-tasks/convert-markdown.js'),
    applyTemplate = require('./file-tasks/apply-template.js'),
    runner = require('minitask').runner;

function copyAssets(from, to) {
  var self = this,
      copied = [];
  // check whether assets folder exists
  if(fs.existsSync(from) && fs.statSync(from).isDirectory()) {
    ncp.limit = 16;
    ncp(from, to, { filter: function(file) {
      copied.push(file);
      return true;
    }
  },
    function (err) {
     if (err) {
       return console.error(err);
     }
     var cwd = process.cwd();
      console.log('Copied assets:\n'+
        copied
          .map(function(name) { return path.relative(self.layout, name); })
          .filter(function(name) { return !!name; })
          .map(function(name) { return '\t' + name; })
          .sort(function(a, b) { return a.localeCompare(b); })
          .join('\n')
        );
    });
  }
  return this;
}

module.exports = function(list, options) {
  var output = options.output,
    // read the template
    templateContent = fs.readFileSync(options.template).toString(),
    cwd = process.cwd();

  // for each file,
  list.files.forEach(function(item) {
    // annotate with metadata

    // create a readable stream
    // run the markdown generation task
    // apply metadata replacements
    var fullpath = output + path.sep + path.basename(item.name, '.md') + '.html',
        meta = options.defaultMeta,
        last;

    last = runner({ stdout: fs.createReadStream(item.name) }, [ convertMarkdown, function() {
      return applyTemplate({
        template: templateContent,
        meta: meta
      });
    } ]);

    console.log(path.relative(cwd, item.name), '->', path.relative(cwd, fullpath));

    // write the output to disk
    last.stdout.pipe(fs.createWriteStream(fullpath));
  });
  // copy assets
  copyAssets(options.layout+'/assets/', output+'/assets/');
};

