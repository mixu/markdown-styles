var fs = require('fs'),
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
    outputPaths = require('./output-paths');

function API() {
  this.config = {};
}


API.prototype.set = function(opts) {
  var pipeline = [
      'glob', glob.stream(opts.input),
      'read', through.obj(function(file, enc, onDone) {
              var stat = fs.statSync(file);
              if (stat.isFile()) {
                this.push({
                  path: file,
                  stat: stat,
                  contents: fs.readFileSync(file).toString()
                });
              }
              onDone();
            }),
      'parse-header', parseHeader(),
      'parse', parseMd(), annotateMarkdownHeadings(), headingsToToc(),
      'convert', convertMd(),
      'template', template({ file: opts.template }),
      'output-paths', outputPaths({ basepath: __dirname, input: __dirname + '/input/', output: __dirname + '/output/' }),
      'write', through.obj(function(file, enc, onDone) {
      console.log(file);
      // push to next transform
      this.push(file);
      onDone();
    })
    ];

  this.pipeline = pipeline;
};

API.prototype.run = function() {
  var stream = splicer.obj(this.pipeline);
};

module.exports = API;
