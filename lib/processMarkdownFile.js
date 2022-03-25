const path = require('path');
const marked = require('marked');

const parseYamlHeader = require('./markdown/parseYamlHeader.js');
const addHeadingIds = require('./markdown/addHeadingIds.js');

module.exports = function(file, opts) {
  // [M] parse any initial yaml block

  file = parseYamlHeader(file);

  // [M] parse markdown

  file.contents = marked.lexer(file.contents);

  // [M] add heading IDs (to the lexer output)

  file = addHeadingIds(file);

  // [M] set file title from either the yaml or from the heading ids

  if (!file.title && file.headings && file.headings[0]) {
    file.title = file.headings[0].text;
  }

  // [M] Compute paths

  var relative = file.path.replace(opts.input + '/', ''),
      outputDir;

  var jsonDir = opts.output + path.sep + 'json' + path.sep + 'files' + path.sep;
  var htmlDir = opts.output + path.sep;

  jsonOutputDir = path.normalize(path.dirname(file.path).replace(opts.input, jsonDir));
  htmlOutputDir = path.normalize(path.dirname(file.path).replace(opts.input, htmlDir));

  var extension = path.extname(file.path);
  // path: full path to the output file
  file.jsonPath = path.normalize(jsonOutputDir + path.sep + path.basename(file.path, extension) + '.json');
  file.htmlPath = path.normalize(htmlOutputDir + path.sep + path.basename(file.path, extension) + '.html');
  // relative: path from top of the tree
  // used in merge-meta to implement cascading scope in meta.json
  file.relative = relative;
  file.relative = file.relative.replace(/\\/g, '/');

  return file;
}
