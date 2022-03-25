var fs = require('fs'),
    path = require('path'),
    pi = require('pipe-iterators'),
    glob = require('wildglob'),
    stream = require('./stream');

const chokidar = require('chokidar');

const processMarkdownFile = require('./processMarkdownFile.js');

module.exports = function(argv, onDone) {

  var finalDone = onDone || function() {};
  var doneCount = 0;
  var expectedDoneCount = 2;
  onDone = function() {
      if (++doneCount == expectedDoneCount) {
          finalDone();
      }
  };


  // --export
  if (argv['export']) {
    pi.fromArray(
      glob.sync(path.normalize(argv['export']).replace(/\/$/, '') + '/**')
    ).pipe(pi.filter(function(filename) {
          var stat = fs.statSync(filename);
          return stat.isFile();
        }))
        .pipe(stream.copy(function(filename) {
          var target = path.normalize(filename.replace(argv['export'], argv.output + '/'));
          console.log('Copy layout file', filename, '=>', target);
          return target;
        }))
        .pipe(pi.devnull().once('finish', finalDone));
    return;
  }

  let files = argv.isSingleFile ? [argv.input] : glob.sync(argv.input.replace(new RegExp(path.sep + '$'), '') + '/**');

  files = files.filter((filename) => {
      var stat = fs.statSync(filename);
      return stat.isFile();
  });

  const markdownFiles = [];
  const otherFiles = [];

  files.forEach((filename) => {
      var ext = path.extname(filename);
      if (ext === '.markdown' ||
          ext === '.mdown' ||
          ext === '.mkd' ||
          ext === '.mkdn' ||
          ext === '.md') {
        markdownFiles.push(filename);
      } else {
        otherFiles.push(filename);
      }
  });

  const template = fs.readFileSync(argv.layout + '/page.html', 'utf8');

  let existingDirectories = {};

  function ensureDirectoryExists(filePath) {
    var writeDir = path.dirname(filePath);
    if (existingDirectories[writeDir]) {
      return;
    }

    try {
      fs.mkdirSync(writeDir, {recursive: true})
    } catch (err) {
      // We will just eat EEXIST errors - we aren't checking if
      // the directory exists before attempting to create it so these are expected.
      if (err && err.code !== 'EEXIST') {
        throw err;
      }
    }
    existingDirectories[writeDir] = true;
  }

  const markdownWork = (filename) => {
    // [R] read the file
    let file = {
      path: filename,
      contents: fs.readFileSync(filename, 'utf8').toString(),
    };

    file = processMarkdownFile(file, argv);

    // [W] ensure that destination paths exist

    ensureDirectoryExists(file.jsonPath);
    ensureDirectoryExists(file.htmlPath);

    // [W] write JSON file with collected metadata

    console.log('Write JSON file', file.jsonPath);
    fs.writeFileSync(file.jsonPath, JSON.stringify(file, null, 2));

    // [M] markdown AST -> HTML

    // [W] write HTML file
    const {title, jsonPath, htmlPath, relative} = file;
    console.log('Write HTML file', file.htmlPath);

    fs.writeFileSync(file.htmlPath, template.replace('{{PAGE TITLE}}', title)
      .replace('{{BOOTSTRAP}}', JSON.stringify({
      title,
      jsonPath: jsonPath.replace(argv.output, ''),
      htmlPath: htmlPath.replace(argv.output, ''),
      relative,
    }, null, 2)));
  };
  markdownFiles.forEach(markdownWork);

  // watcher

  const watcher = chokidar.watch(markdownFiles, { persistent: true, ignoreInitial: true, usePolling: true, interval: 1000, binaryInterval: 3000});
  watcher.on('change', (path, stats) => {
    console.log(`File ${path} changed`);
    markdownWork(path);
  });


  // copy other files
  const assetDir = path.normalize(argv.layout + '/assets').replace(/\/$/, '');

  otherFiles.forEach((filename) => {
    var target = path.normalize(filename.replace(argv.input, argv.output));
    ensureDirectoryExists(target);
    console.log('Copy non-markdown file', filename, '=>', target);
    fs.copyFileSync(filename, target);
  });


  // copy assets
  if (fs.existsSync(assetDir)) {
    pi.fromArray(glob.sync(assetDir + '/**'))
        .pipe(pi.filter(function(filename) {
          const inputStat = fs.statSync(filename);
          // Skip non-files
          if (!inputStat.isFile()) {
            return false;
          }

          const target = path.normalize(filename.replace(assetDir, argv.output + '/assets/'));
          const targetStat = fs.statSync(target);
          // TODO better heuristics here...
//          if (targetStat && targetStat.size === inputStat.size) {
//            console.log('Skip', filename);
//            return false;
//          }
          return true;
        }))
        .pipe(stream.copy(function(filename) {
          var target = path.normalize(filename.replace(assetDir, argv.output + '/assets/'));
          console.log('Copy asset file', filename, '=>', target);
          return target;
        }))
        .pipe(pi.devnull().once('finish', onDone));
  } else {
    console.log('Assets path does not exist: ' + assetDir + ', so no assets were copied.');
    // always call onDone to increment the number of completed tasks
    onDone();
  }
};
