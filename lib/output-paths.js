function outputPaths(opts) {
  return through.obj(function(file, enc, onDone) {
    var name = file.path;
    // outputDir: path to the directory where the output goes
    var outputDir = path.normalize( path.dirname(name).replace(opts.input, opts.output + path.sep));
    // outputFull: full path to the output file
    file.path = path.normalize( outputDir + path.sep + path.basename(name));
    this.push(file);
    onDone();
  });
}

module.exports = outputPaths;
