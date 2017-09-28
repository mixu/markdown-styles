var fs = require('fs'),
    path = require('path'),
    pi = require('pipe-iterators'),
    glob = require('wildglob'),
    pipeline = require('./pipeline'),
    stream = require('./stream');

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
  pi.fromArray(files).pipe(pi.head([

    pi.filter(function(filename) {
      var stat = fs.statSync(filename);
      return stat.isFile();
    }),

    pi.match(
      // for non-markdown files: copy the file.
      function(filename) {
        var ext = path.extname(filename);
        if (ext === '.markdown' ||
            ext === '.mdown' ||
            ext === '.mkd' ||
            ext === '.mkdn' ||
            ext === '.md') {
          return false;
        }
        return true;
      },
      stream.copy(function(filename) {
        if (path.basename(filename) === 'meta.json') {
          return false;
        }
        var target = path.normalize(filename.replace(argv.input, argv.output));
        console.log('Copy non-markdown file', filename, '=>', target);
        return target;
      }),
      // rest:
      pi.head([
        stream.read(),
        pipeline(argv),
        stream.write().once('finish', onDone)
      ])
    )
  ]));


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
