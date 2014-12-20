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
    runner = require('minitask').runner,
    spawn = require('./file-tasks/spawn.js');

module.exports = function(list, options) {
  var output = options.output,
    // read the template
    templateContent = fs.readFileSync(options.template).toString(),
    cwd = process.cwd(),
    metaFile = {};

  list.files = list.files.filter(function(item) {
    return path.extname(item.name) == '.md';
  });

  if(fs.statSync(options.input).isFile()) {
    options.input = path.dirname(options.input);
  }

  annotateBasepath(list);
  annotateInputOutputPaths(list, { basepath: list.basepath, input: options.input, output: output });
  annotateStructured(list);

  // load the metadata file if it exists
  if(fs.existsSync(process.cwd() + '/meta.json')) {
    metaFile = require(process.cwd() + '/meta.json');
  }

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

    meta.assetsRelative = path.relative(item.outputDir, options.assetDir || options.output + '/assets/' );

    // add css via {{styles}}
    meta.styles = [];
    Object.keys(options.highlight).forEach(function(extension) {
      var mod = options.highlight[extension];
      if (mod.css) {
        meta.styles.push(mod.css());
      }
    });

    var partials = Object.create(null);
    if (options.partials && fs.existsSync(options.partials) && fs.statSync(options.partials).isDirectory()) {
      fs.readdirSync(options.partials).forEach(function(file) {
        var filePath = path.join(options.partials, file);
        if (fs.statSync(filePath).isFile()) {
          var baseName = path.basename(file, path.extname(file));
          partials[baseName] = fs.readFileSync(filePath).toString();
        }
      });
    }

    var tasks = [
      function() {
        return new convertMarkdown({
          highlight: options.highlight
        });
      },
      function() {
        return applyTemplate({
          template: templateContent,
          partials: partials,
          meta: meta
        });
      }
    ];

    // if a external command is applied, shift it onto the stack
    if(options.command) {
      tasks.unshift(spawn({
        name: item.name, // full path
        task: options.command
      }));
    }

    // create a readable stream
    // run the markdown generation task
    // apply metadata replacements
    last = runner({ stdout: fs.createReadStream(item.name) }, tasks);

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
