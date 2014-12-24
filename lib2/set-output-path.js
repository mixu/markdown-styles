var path = require('path'),
    pi = require('pipe-iterators');

module.exports = function(opts) {
  return pi.map(function(item) {
    var relative = item.path.replace(opts.input + '/', '');
    var outputDir = path.normalize(path.dirname(item.path).replace(opts.input, opts.output + path.sep));
    // path: full path to the output file
    item.path = path.normalize(outputDir + path.sep + path.basename(item.path, '.md') + '.html' );
    // projectName: either the file name, or the folder name of this file
    var isDirectory = (relative.indexOf('/') > -1);
    item.projectName = (isDirectory ? path.dirname(relative) : path.basename(relative, '.md'));

    // determine the relative path to ./output/assets
    // -- since files can be in subdirs like: sub/sub/dir/index.html

    item.assetsRelative = path.relative(outputDir, opts.assetDir);

    return item;
  });
};
