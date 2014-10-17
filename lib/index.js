var fs = require('fs'),
    path = require('path'),
    glob = require('wildglob'),
    through = require('through2'),
    splicer = require('labeled-stream-splicer');

var parseHeader = require('./parse-header.js'),
    parseMd = require('./parse-md.js'),
    annotateMarkdownHeadings = require('./annotate-md-headings.js'),
    convertMd = require('./convert-md.js'),
    headingsToToc = require('./headings-to-toc.js'),
    template = require('./template'),
    dest = require('./dest'),
    outputPaths = require('./output-paths'),
    read = require('./read');

function log() {
  return through.obj(function(file, enc, onDone) {
    console.log(file);
    this.push(file);
    onDone();
  });
}

function API() {
  this.opts = {};
}


API.prototype.set = function(opts) {
  var layoutDir = __dirname + '/../layouts/',
      defaults = {
        layout: 'jasonm23-markdown',
        basepath: process.cwd() // todo: better inference
      };

  Object.keys(defaults).forEach(function(key) {
    if (typeof opts[key] === 'undefined') {
      opts[key] = defaults[key];
    }
  });

  // template is one of:
  [ opts.basepath + '/' + opts.layout, // 1) the supplied argument (normalized)
    layoutDir + opts.layout + '/page.hbs', // 2) a preset layout from the layout dir
    layoutDir + 'plain/page.hbs' // 3) the default layout
  ].some(function(p) {
    var exists = fs.existsSync(p);
    if (exists) {
      opts.template = path.normalize(p);
    }
    return exists;
  });

  this.opts = opts;

  this.pipeline = splicer.obj([
      'read', read(),
      'parse-header', parseHeader(),
      'parse', parseMd(), annotateMarkdownHeadings(), headingsToToc(),
      'convert', convertMd(),
      'template', template({ file: opts.template }),
      'output-paths', outputPaths({ basepath: opts.basepath, input: opts.input, output: opts.output }),
      'write', dest()
  ]);
};

API.prototype.run = function() {
  glob.stream(this.opts.input).pipe(this.pipeline);
};

module.exports = API;
