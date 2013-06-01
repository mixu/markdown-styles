var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    convertMarkdown = require('./file-tasks/convert-markdown.js'),
    applyTemplate = require('./file-tasks/apply-template.js'),
    annotateBasepath = require('./list-tasks/annotate-basepath.js'),
    annotateStructured = require('./list-tasks/annotate-structured.js'),
    annotateInputOutputPaths = require('./list-tasks/annotate-input-output-paths.js'),
    copyAssets = require('./misc-tasks/copy-assets.js'),
    merge =  require('./misc-tasks/merge-hash.js'),
    runner = require('minitask').runner;

module.exports = function(list, options) {
  var output = options.output,
    // read the template
    templateContent = fs.readFileSync(options.template).toString(),
    cwd = process.cwd(),
    metaFile = {};

  list.files = list.files.filter(function(item) {
    return path.extname(item.name) == '.md';
  });

  annotateBasepath(list);
  annotateInputOutputPaths(list, { basepath: list.basepath, input: options.input, output: output });
  annotateStructured(list);

  // load the metadata file if it exists
  if(fs.existsSync(process.cwd() + '/meta.json')) {
    metaFile = require(process.cwd() + '/meta.json');
  }

  console.log(options)
  console.log(list.files)

  // for each file,
  list.files.forEach(function(item) {

    // check that the output dir exists
    var meta = {},
        last,
        relpath = item.relative;

    if(!fs.existsSync(item.outputDir)) {
      mkdirp.sync(item.outputDir);
    }

    // merge in defaultMeta and project metadata
    meta = merge(meta, options.defaultMeta, metaFile[item.projectName]);

    // determine the relative path to ./output/assets
    // -- since files can be in subdirs like: sub/sub/dir/index.html

    meta.assetsRelative = path.relative( item.outputDir, options.output + '/assets/' );

    // create a readable stream
    // run the markdown generation task
    // apply metadata replacements
    last = runner({ stdout: fs.createReadStream(item.name) }, [ convertMarkdown, function() {
      return applyTemplate({
        template: templateContent,
        meta: meta
      });
    } ]);

    console.log(path.relative(cwd, item.name), '->', path.relative(cwd, item.outputFull));

    // write the output to disk
    last.stdout.pipe(fs.createWriteStream(item.outputFull));
  });
  // copy assets
  // 1) lookup from the dir in which the template is
  if(fs.existsSync(path.dirname(options.template) + '/assets/')) {
    copyAssets(path.dirname(options.template) + '/assets/', output+'/assets/');
  } else {
    // 2) try the builtin template dir
    copyAssets(__dirname + '/../layouts/' + options.layout+'/assets/', output+'/assets/');
  }
};

