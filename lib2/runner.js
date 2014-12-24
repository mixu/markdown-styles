var fs = require('fs'),
    path = require('path');

var pi = require('pipe-iterators'),
    glob = require('wildglob'),
    md = require('markdown-stream-utils'),
    merge = require('../lib/misc-tasks/merge-hash'),
    setOutputPath = require('../lib2/set-output-path'),
    stream = require('../lib2/stream');

module.exports = function(argv) {
  // read the template
  var templateContent = fs.readFileSync(argv.template).toString(),
      metaFile = {},
      meta = {};

  // load the metadata file if it exists
  if(fs.existsSync(process.cwd() + '/meta.json')) {
    metaFile = require(process.cwd() + '/meta.json');
  }

  // merge in defaultMeta
  meta = merge(meta, { title: 'example' });

  // add css via {{styles}}

  // load partials and helpers
  var partials = {},
      helpers = {},
      complete = 0;

  if (argv.partials) {
    glob.stream(argv.partials + '/*')
        .pipe(pi.filter(function(filename) {
            var stat = fs.statSync(filename);
            return stat.isFile();
        }))
        .pipe(stream.read())
        .pipe(pi.map(function(item) {
          var basename = path.basename(item.path, path.extname(item.path));
          helpers[basename] = require(filename);
        }))
        .pipe(pi.devnull())
        .once('finish', function() {
          if (++complete == 2) {
            next();
          }
        });
  } else {
    complete++;
  }

  if (argv.helpers) {
    glob.stream(argv.helpers + '/*')
        .pipe(pi.filter(function(filename) {
            var stat = fs.statSync(filename);
            return stat.isFile();
        }))
        .pipe(pi.map(function(filename) {
          var basename = path.basename(filename, path.extname(filename));
          helpers[basename] = require(filename);
        }))
        .pipe(pi.devnull())
        .once('finish', function() {
          if (++complete == 2) {
            next();
          }
        });
  } else {
    complete++;
  }
  if (complete == 2) {
    next();
  }

  function next() {
    glob.stream(argv.input + '/**')
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
          var target = path.normalize(filename.replace(config.input, config.output));
          console.log('Copy non-markdown file', filename, '=>', target);
          return target;
        }),
        // rest:
        pi.head([
          stream.read(),
          md.parseHeader(),
          md.parseMd(),
          md.annotateMdHeadings(),
          md.highlightJs(),
          md.convertMd(),

          // map paths
          setOutputPath({
            input: argv.input,
            output: argv.output,
            assetDir: argv.assetDir || argv.output + '/assets/'
          }),

          // convert headings to toc
          headingsToToc(),

          // apply handlebars templates
          applyTemplate({
            template: templateContent,
            partials: partials,
            helpers: helpers,
            meta: meta
          }),

          write()
        ])
      )
    ]));


    // copy assets
    // 1) lookup from the dir in which the template is
    var assetDir;
    if(fs.existsSync(path.dirname(argv.template) + '/assets/')) {
      assetDir = path.dirname(argv.template) + '/assets/';
    } else {
      // 2) try the builtin template dir
      assetDir = __dirname + '/../layouts/' + argv.layout + '/assets/';
    }
    if(fs.existsSync(assetDir)) {
      glob.stream(assetDir + '/**')
          .pipe(stream.copy(function(filename) {
            var target = path.normalize(filename.replace(assetDir, argv.output + '/assets/'));
            console.log('Copy asset file', filename, '=>', target);
            return target;
          }))
          .pipe(pi.devnull());
    } else {
      console.log('Assets path does not exist: ' + assetDir + ', so no assets were copied.');
    }
  }
};
