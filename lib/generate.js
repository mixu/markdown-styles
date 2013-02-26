var fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    ncp = require('ncp').ncp;

function Generator(config) {
  this.cwd = process.cwd();
  this.files = [];
  this.output = config.output;
  this.layout = config.layout;
  this._defaultMeta = {};
}

// resolves paths to files
Generator.prototype.paths = function paths(inputs) {
  var self = this,
      inputs = ['./input/'],
      files = [];

  function iterate(dir) {
    var items = fs.readdirSync(dir);
    items.forEach(function(item) {
      item = path.normalize(dir+ '/' +item);

      var stat = fs.statSync(item);
      if(stat.isFile()) {
        files.push(item);
      }
      // TODO recurse into directories
      // TODO check that output directory exists

    });
  }

  inputs.map(function(input) {
    return path.normalize(self.cwd + '/' +input);
  }).forEach(iterate);

  console.log(files);
  this.files = files;

  return this;
};

// adds metadata for "next", "prev" and "index"
// to the `each` call
Generator.prototype.sort = function() {
  // process the files according to the order array
  var full = config.order.map(function(infile, index) {
    var fullname = path.resolve(config.input+'/'+infile+'.md');
    return BookGen.writeFile({
        filename: fullname,
        prev: config.order[index-1] || 'index',
        next: config.order[index+1],
        index: index
      }, config);
  }).join('');

  return this;
};

Generator.prototype.defaultMeta = function(hash) {
  for (var key in hash) { hash.hasOwnProperty(key) && (this._defaultMeta[key] = hash[key]); }
  return this;
};

Generator.prototype.copyAssets = function() {
  var self = this, assetsDir = this.layout+'/assets/';
  // check whether assets folder exists
  if(fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
    ncp.limit = 16;
    ncp(assetsDir, self.output+'/assets/', { filter: function(file) {
      console.log('Copying ' + file);
      return true;
    }
  },
    function (err) {
     if (err) {
       return console.error(err);
     }
    });
  }
  return this;
};

Generator.prototype.each = function(callback) {
  var self = this;
  this.files.forEach(function(sourceFile) {
    var targetFile = self.output + path.basename(sourceFile, '.md') + '.html',
        tokens = marked.lexer(fs.readFileSync(sourceFile).toString()),
        meta = self._defaultMeta,
        content = marked
                    .parser(tokens)
                    .replace(/<(ul|ol)>/g, '<$1 class="list">')
                    .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/mg, '<pre>$1</pre>')
                    .replace(/<p><img([^>]*)>\s*<\/p>/g, '<p class="img-container"><img$1></p>');
    callback(sourceFile, targetFile, content, meta);
  });

  return this;
};

module.exports = Generator;
