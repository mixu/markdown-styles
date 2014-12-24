var assert = require('assert'),
    pi = require('pipe-iterators'),
    setOutputPath = require('../lib2/set-output-path');

describe('set output path', function() {

  it('can set a basic output path', function(done) {
    pi.fromArray([ { path: '/input/bar.md' }, { path: '/input/baz.md' } ])
      .pipe(setOutputPath({
        input: '/input',
        output: '/output',
        assetDir: '/output/assets'
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            path: '/output/bar.html',
            projectName: 'bar',
            assetsRelative: 'assets'
          },
          {
            path: '/output/baz.html',
            projectName: 'baz',
            assetsRelative: 'assets'
          }
        ]);
        done();
      }));
  });

});

