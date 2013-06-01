var assert = require('assert'),
    util = require('util');

var annotateInputOutputPaths = require('../../lib/list-tasks/annotate-input-output-paths.js');

exports['flat single directory input'] = function() {
  var list = {
    files: [
      { name: '/input/index.md' },
      { name: '/input/foo.md' }
    ]
  };

  annotateInputOutputPaths(list, { basepath: '/input', input: '/input', output: '/output' });
  assert.deepEqual(list,{ files: [
     { name: '/input/index.md',
       outputDir: '/output/',
       outputFull: '/output/index.html',
       relative: 'index.md',
       projectName: 'index' },
     { name: '/input/foo.md',
       outputDir: '/output/',
       outputFull: '/output/foo.html',
       relative: 'foo.md',
       projectName: 'foo' }
    ]});
};

exports['one level deep directory input'] = function() {
  var list = {
    files: [
      { name: '/input/index.md' },
      { name: '/input/foo/index.md' },
      { name: '/input/bar/index.md' }
    ]
  };

  annotateInputOutputPaths(list, { basepath: '/input', input: '/input', output: '/output' });

  assert.deepEqual(list, { files: [
     { name: '/input/index.md',
       outputDir: '/output/',
       outputFull: '/output/index.html',
       relative: 'index.md',
       projectName: 'index' },
     { name: '/input/foo/index.md',
       outputDir: '/output/foo',
       outputFull: '/output/foo/index.html',
       relative: 'foo/index.md',
       projectName: 'foo' },
     { name: '/input/bar/index.md',
       outputDir: '/output/bar',
       outputFull: '/output/bar/index.html',
       relative: 'bar/index.md',
       projectName: 'bar' }
  ]});
};

exports['more deep directory input'] = function() {
  var list = {
    files: [
      { name: '/input/index.md' },
      { name: '/input/2012/01/01/index.md' },
      { name: '/input/2013/01/01/index.md' }
    ]
  };

  annotateInputOutputPaths(list, { basepath: '/input', input: '/input', output: '/output' });
  console.log(list);

  assert.deepEqual(list, { files: [
     { name: '/input/index.md',
       outputDir: '/output/',
       outputFull: '/output/index.html',
       relative: 'index.md',
       projectName: 'index' },
     { name: '/input/2012/01/01/index.md',
       outputDir: '/output/2012/01/01',
       outputFull: '/output/2012/01/01/index.html',
       relative: '2012/01/01/index.md',
       projectName: '2012/01/01' },
     { name: '/input/2013/01/01/index.md',
       outputDir: '/output/2013/01/01',
       outputFull: '/output/2013/01/01/index.html',
       relative: '2013/01/01/index.md',
       projectName: '2013/01/01' }
    ]})

};

// if this module is the script being run, then run the tests:
if (module == require.main) {
  var mocha = require('child_process').spawn('mocha', [ '--colors', '--ui', 'exports', '--reporter', 'spec', __filename ]);
  mocha.stderr.on('data', function (data) { if (/^execvp\(\)/.test(data)) console.log('Failed to start child process. You need mocha: `npm install -g mocha`') });
  mocha.stdout.pipe(process.stdout);
  mocha.stderr.pipe(process.stderr);
}
