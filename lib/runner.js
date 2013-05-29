var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    convertMarkdown = require('./file-tasks/convert-markdown.js'),
    applyTemplate = require('./file-tasks/apply-template.js'),
    annotateBasepath = require('./list-tasks/annotate-basepath.js'),
    annotateStructured = require('./list-tasks/annotate-structured.js'),
    copyAssets = require('./misc-tasks/copy-assets.js'),
    merge =  require('./misc-tasks/merge-hash.js'),
    runner = require('minitask').runner;

module.exports = function(list, options) {
  var output = options.output,
    // read the template
    templateContent = fs.readFileSync(options.template).toString(),
    cwd = process.cwd(),
    metaFile = {};

  annotateBasepath(list);
  annotateStructured(list);

  // load the metadata file if it exists
  if(fs.existsSync(process.cwd() + '/meta.json')) {
    metaFile = require(process.cwd() + '/meta.json');
  }

  // for each file,
  list.files.forEach(function(item) {

    // check that the output dir exists
    var fulloutpath = path.resolve(cwd, path.dirname(item.name.replace(list.basepath, output + path.sep))),
        fullpath = fulloutpath + path.sep + path.basename(item.name, '.md') + '.html',
        meta = {},
        last,
        relpath = item.name.replace(options.input, ''),
        isDirectory = (relpath.indexOf('/') > -1),
        projectName = (isDirectory ? path.dirname(relpath) : path.basename(relpath, '.md'));

    if(!fs.existsSync(fulloutpath)) {
      mkdirp.sync(fulloutpath);
    }

    // merge in defaultMeta and project metadata
    meta = merge(meta, options.defaultMeta, metaFile[projectName]);

    // create a readable stream
    // run the markdown generation task
    // apply metadata replacements
    last = runner({ stdout: fs.createReadStream(item.name) }, [ convertMarkdown, function() {
      return applyTemplate({
        template: templateContent,
        meta: meta
      });
    } ]);

    console.log(path.relative(cwd, item.name), '->', path.relative(cwd, fullpath));

    // write the output to disk
    last.stdout.pipe(fs.createWriteStream(fullpath));
  });
  // copy assets
  copyAssets(options.layout+'/assets/', output+'/assets/');
};

