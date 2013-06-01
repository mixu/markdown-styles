var path = require('path');

module.exports = function(list, options) {
  list.files.forEach(function(item) {
    // outputDir: path to the directory where the output goes
    item.outputDir = path.normalize( path.dirname(item.name).replace(options.input, options.output + path.sep));
    // outputFull: full path to the output file
    item.outputFull = path.normalize( item.outputDir + path.sep + path.basename(item.name, '.md') + '.html' );
    // relative: path relative to the input base dir
    item.relative = item.name.replace(options.input + '/', '');
    // projectName: either the file name, or the folder name of this file
    var isDirectory = (item.relative.indexOf('/') > -1);
    item.projectName = (isDirectory ? path.dirname(item.relative) : path.basename(item.relative, '.md'));
  });
};
