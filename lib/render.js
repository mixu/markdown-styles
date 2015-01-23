var fs = require('fs'),
    path = require('path'),
    pi = require('pipe-iterators'),
    glob = require('wildglob'),
    pipeline = require('./pipeline'),
    stream = require('./stream');

module.exports = function(argv, onDone) {
  glob.stream(fs.statSync(argv.input).isFile() ? argv.input : argv.input + '/**')
      .pipe(pi.head([

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
        stream.write().once('finish', function() {
          if (onDone) {
            onDone();
          }
        })
      ])
    )
  ]));


  // copy assets
  if(argv.assetDir && fs.existsSync(argv.assetDir)) {
    glob.stream(argv.assetDir + '/**')
        .pipe(pi.filter(function(filename) {
          var stat = fs.statSync(filename);
          return stat.isFile();
        }))
        .pipe(stream.copy(function(filename) {
          var target = path.normalize(filename.replace(argv.assetDir, argv.output + '/assets/'));
          console.log('Copy asset file', filename, '=>', target);
          return target;
        }))
        .pipe(pi.devnull());
  } else {
    if (argv.assetDir) {
      console.log('Assets path does not exist: ' + argv.assetDir + ', so no assets were copied.');
    } else {
      console.log('No asset directory was found, so no assets were copied.');
    }
  }
};
