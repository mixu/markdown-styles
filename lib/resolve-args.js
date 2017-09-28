var fs = require('fs'),
    path = require('path'),
    nodeResolve = require('resolve');

var layoutDir = __dirname + '/../layouts/';

module.exports = function(argv) {
  // defaults
  argv.input = path.resolve(process.cwd(), argv.input || './input/');
  try {
    argv.isSingleFile = fs.statSync(argv.input).isFile();
  } catch (e) {
    argv.isSingleFile = false;
  }
  argv.output = path.resolve(process.cwd(), argv.output || './output/');
  if (!argv.layout) {
    if (argv['export']) {
      argv.layout = argv['export'];
    } else {
      argv.layout = 'github';
    }
  }

  if (argv.template) {
    throw new Error('--template is deprecated in v2.0, please point --layout to ' +
      'the layout directory with ./page.html in it.');
  }
  if (argv['asset-dir'] || argv.assetDir) {
    throw new Error('--asset-dir is deprecated in v2.0, please point --layout to ' +
      'the layout directory with ./page.html and ./assets in it.');
  }
  if (argv.command) {
    throw new Error('--command is deprecated in v2.0');
  }
  if (argv.runner) {
    throw new Error('--runner is deprecated in v2.0');
  }

  // we only accept a single layout argument, --layout
  if (argv.layout && argv.layout.charAt(0) === '/' && fs.existsSync(argv.layout)) {
    // 1) it can be an absolute path to a folder with ./page.html
    argv.layout = path.normalize(argv.layout);
  } else if (fs.existsSync(process.cwd() + '/' + argv.layout)) {
    // 2) it can be a relative path
    argv.layout = path.normalize(process.cwd() + '/' + argv.layout);
  } else if (fs.existsSync(layoutDir + argv.layout + '/')) {
    // 3c) it can be the name of a builtin layout
    argv.layout = path.normalize(layoutDir + argv.layout + '/');
  }

  if (argv['export']) {
    argv['export'] = argv.layout;
  }

  // in node.js 6.x path.dirname expects a string
  if(argv.template && typeof argv.template === 'string') {
    // set up partials and helpers directories
    var layoutBase = path.dirname(argv.template);
    ['partials', 'helpers'].forEach(function(name) {
      if (argv[name]) {
        argv[name] = path.resolve(process.cwd(), argv[name]);
      } else if (fs.existsSync(layoutBase + '/' + name)) {
        // if the folder exists in the layout, use it automatically
        argv[name] = layoutBase + '/' + name;
      }
    });
  }

  // parse --highlight-<extension>
  var hl = {};

  Object.keys(argv).forEach(function(name) {
    var matched = (typeof name === 'string' ? name.match(/highlight\-(.*)/) : false);
    if (matched) {
      var ext = matched[1];
      argv[name] = findModule(argv[name], [process.cwd, __dirname]);
      try {
        hl[ext] = require(argv[name]);
      } catch(err) {
        console.error(err);
        throw err;
      }
    }
  });

  argv['highlight'] = hl;
  return argv;
};

function findModule(name) {
  var result = '';
  try {
    result = nodeResolve.sync(name, { basedir: process.cwd() });
  } catch (e) {
    try {
      result = nodeResolve.sync(name, { basedir: __dirname });
    } catch (err) {
      console.error('Cannot find module ' + name + ' from ' + process.cwd() + ' or ' + __dirname);
      throw err;
    }
  }
  return result;
}
