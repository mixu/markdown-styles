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
    // projectName: either the file name, or the folder name of this file
    var isInDirectory = (relative.indexOf('/') > -1);

    if (isInDirectory) {
      item.projectName = path.dirname(relative);
    } else {
      item.projectName = path.basename(relative, extension);
    }

    // determine the relative path to ./output/assets
    // -- since files can be in subdirs like: sub/sub/dir/index.html

    item.assetsRelative = path.relative(outputDir, opts.output + '/assets');

    return item;
  });
};
