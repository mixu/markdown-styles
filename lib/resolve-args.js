var fs = require('fs'),
    path = require('path');

var layoutDir = __dirname + '/../layouts/';

module.exports = function(argv) {
  // defaults
  argv.input = path.resolve(process.cwd(), argv.input || './input/');
  argv.output = path.resolve(process.cwd(), argv.output || './output/');
  if(!argv.layout) {
    argv.layout = 'github';
  }

  // template is one of:
  if(fs.existsSync(process.cwd() + '/' + argv.layout)) {
    // 1) the supplied argument (normalized)
    argv.template = path.normalize(process.cwd() + '/' + argv.layout);
  } else if(fs.existsSync(layoutDir + argv.layout + '/page.html')) {
    // 2) a preset layout from the layout dir
    argv.template = path.normalize(layoutDir + argv.layout + '/page.html');
  } else {
    // 3) the default layout
    argv.template = path.normalize(layoutDir + 'plain/page.html');
  }

  if(argv.layouts || !fs.existsSync(argv.input)) {
    return argv;
  }

  var layoutBase = path.dirname(argv.template);
  ['partials', 'helpers'].forEach(function(name) {
    if (argv[name]) {
      argv[name] = path.resolve(process.cwd(), argv[name]);
    } else if (fs.existsSync(layoutBase + '/' + name)) {
      // if the folder exists in the layout, use it automatically
      argv[name] = layoutBase + '/' + name;
    }
  });

  if(argv['command']) {
    argv['command'] = argv['command'].split(' ');
  }


  // parse --highlight-<extension>
  var hl = {};

  Object.keys(argv).forEach(function(name) {
    var matched = (typeof name === 'string' ? name.match(/highlight\-(.*)/) : false);
    if(name == 'highlight') {
      argv[name] = findModule(argv[name], [ process.cwd, __dirname ]);
      hl['default'] = require(argv[name]);
    } else if(matched) {
      var ext = matched[1];
      argv[name] = findModule(argv[name], [ process.cwd, __dirname ]);
      hl[ext] = require(argv[name]);
    }
  });


  argv['highlight'] = hl;

  // 1) lookup from the dir in which the template is
  if(argv['asset-dir']) {
    argv.assetDir = path.resolve(process.cwd(), argv['asset-dir']);
  } else if (fs.existsSync(path.dirname(argv.template) + '/assets/')) {
    argv.assetDir = path.normalize(path.dirname(argv.template) + '/assets/');
  } else if (argv.layout) {
    // 2) try the builtin template dir
    argv.assetDir = path.normalize(__dirname + '/../layouts/' + argv.layout + '/assets/');
  }

  return argv;
};
