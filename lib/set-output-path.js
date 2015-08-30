var path = require('path'),
    pi = require('pipe-iterators');

module.exports = function(opts) {
  return pi.map(function(item) {
    var relative = item.path.replace(opts.input + '/', ''),
        outputDir;

    if (opts.isSingleFile) {
      outputDir = path.normalize(item.path.replace(opts.input, opts.output + path.sep));
    } else {
      outputDir = path.normalize(path.dirname(item.path).replace(opts.input, opts.output + path.sep));
    }
    var extension = path.extname(item.path);
    // path: full path to the output file
    item.path = path.normalize(outputDir + path.sep + path.basename(item.path, extension) + '.html');
    // relative: path from top of the tree
    // used in merge-meta to implement cascading scope in meta.json
    item.relative = relative;

    // determine the relative path to ./output/assets
    // -- since files can be in subdirs like: sub/sub/dir/index.html

    item.assetsRelative = path.relative(outputDir, opts.output + '/assets');

    return item;
  });
};
