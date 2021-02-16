var fs = require('fs'),
    path = require('path'),
    pi = require('pipe-iterators'),
    glob = require('wildglob'),
    stream = require('./stream');

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

  var files = argv.isSingleFile ? [argv.input] : glob.sync(argv.input.replace(new RegExp(path.sep + '$'), '') + '/**');


  const markdownFiles = files.filter((filename) => {
      var stat = fs.statSync(filename);
      return stat.isFile();
  }).filter((filename) => {
      var ext = path.extname(filename);
      if (ext === '.markdown' ||
          ext === '.mdown' ||
          ext === '.mkd' ||
          ext === '.mkdn' ||
          ext === '.md') {
        return true;
      }
      return false;
  });

  markdownFiles.forEach((filename) => {
    // [R] read the file
    let file = {
      path: filename,
      contents: fs.readFileSync(filename).toString(),
    };

    file = processMarkdownFile(file, argv);

    // TODO ensure that destination paths exist


    // [W] write JSON file with collected metadata

    console.log('Write JSON file', file.jsonPath);
    fs.writeFileSync(file.jsonPath, JSON.stringify(file, null, 2));

    // [M] markdown AST -> HTML

    // [W] write HTML file


  });

  // copy assets
  var assetDir = path.normalize(argv.layout + '/assets').replace(/\/$/, '');
  if (fs.existsSync(assetDir)) {
    pi.fromArray(glob.sync(assetDir + '/**'))
        .pipe(pi.filter(function(filename) {
          var stat = fs.statSync(filename);
          return stat.isFile();
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
