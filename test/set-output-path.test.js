var assert = require('assert'),
    pi = require('pipe-iterators'),
    setOutputPath = require('../lib/set-output-path');

describe('set output path', function() {

  it('can set a basic output path for files', function(done) {
    pi.fromArray([{ path: '/input/bar.md' }, { path: '/input/baz.md' }])
      .pipe(setOutputPath({
        input: '/input',
        output: '/output',
        assetDir: '/output/assets'
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            path: '/output/bar.html',
            relative: 'bar.md',
            assetsRelative: 'assets'
          },
          {
            path: '/output/baz.html',
            relative: 'baz.md',
            assetsRelative: 'assets'
          }
        ]);
        done();
      }));
  });

  it('can set a basic output path for subdirectories', function(done) {
    pi.fromArray([{ path: '/input/bar/baz.md' }, { path: '/input/a/b/c.md' }])
      .pipe(setOutputPath({
        input: '/input',
        output: '/output',
        assetDir: '/output/assets'
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            path: '/output/bar/baz.html',
            relative: 'bar/baz.md',
            assetsRelative: '../assets'
          },
          {
            path: '/output/a/b/c.html',
            relative: 'a/b/c.md',
            assetsRelative: '../../assets'
          }
        ]);
        done();
      }));
  });


});

