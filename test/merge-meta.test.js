var assert = require('assert'),
    pi = require('pipe-iterators'),
    mergeMeta = require('../lib/merge-meta');

describe('merge meta', function() {

  /*

  The keys in meta.json represent file paths relative to the root of the input directory.
  Each file will be rendered with the merged metadata. The merge proceeds as follows:

  - Start with an empty object
  - Read the `*` key in `meta.json`
  - Take split the pathname of the current file relative to the input directory
    by the path separator (`/` in Linux/OSX and `\\` in Windows;
    note that the key lookup will always use `/` on all platforms).
    For example, if the filename is `./input/a/b/c.md` and the input directory is `./input`,
    then the path components would be `a`, `b`.
  - Concatenate the components one by one and look for keys that end with
    the concatenated path + `/*`. For example, for `./input/a/b/c.md`,
    the keys will be `a/*`, `a/b/*`.
  - Merge the metadata values from the keys in order of specificity,
    e.g. starting with the values under the `*` key, then `a/*`, then `a/b/*`.
  - Look for a key that matches the full relative file name without the extension.
    e.g. `a/b/c`, and merge that in.
  - Read the file, and overwrite the metadata values with the values set in the file.
  - Finally, if the title property is still not set, automatically set using the
    first heading in the markdown file.
  */

  it('reads the * key', function(done) {
    pi.fromArray([{ relative: '/a/b/c.md' }])
      .pipe(mergeMeta({
        '*': {
          '*': '*',
          a: '*'
        },
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md',
            '*': '*',
            a: '*'
          }
        ]);
        done();
      }));
  });

  it('reads the * key and the a/* key and merges', function(done) {
    pi.fromArray([{ relative: '/a/b/c.md' }])
      .pipe(mergeMeta({
        '*': {
          '*': '*',
          a: '*'
        },
        'a/*': {
          a: 'a'
        },
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md',
            '*': '*',
            a: 'a'
          }
        ]);
        done();
      }));
  });

  it('reads the keys *, a/*, a/b/* and merges', function(done) {
    pi.fromArray([{ relative: '/a/b/c.md' }])
      .pipe(mergeMeta({
        '*': {
          '*': '*',
          a: '*',
          b: '*'
        },
        'a/*': {
          a: 'a',
          b: 'a'
        },
        'a/b/*': {
          b: 'b'
        },
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md',
            '*': '*',
            a: 'a',
            b: 'b'
          }
        ]);
        done();
      }));
  });

  it('reads the keys *, a/*, a/b/*, the file\'s metadata and merges', function(done) {
    pi.fromArray([{
        relative: '/a/b/c.md',
        file: 'file',
      }])
      .pipe(mergeMeta({
        '*': {
          '*': '*',
          a: '*',
          b: '*',
          file: '*'
        },
        'a/*': {
          a: 'a',
          b: 'a',
          file: 'a'
        },
        'a/b/*': {
          b: 'b',
          file: 'b'
        },
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md',
            '*': '*',
            a: 'a',
            b: 'b',
            file: 'file'
          }
        ]);
        done();
      }));
  });

  it('reads all of the metadata keys above, and then auto-detects the title key from the headings', function(done) {
    pi.fromArray([{
        relative: '/a/b/c.md',
        file: 'file',
        headings: [{ text: 'heading-name' }],
      }])
      .pipe(mergeMeta({
        '*': {
          '*': '*',
          a: '*',
          b: '*',
          file: '*'
        },
        'a/*': {
          a: 'a',
          b: 'a',
          file: 'a'
        },
        'a/b/*': {
          b: 'b',
          file: 'b'
        },
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md',
            '*': '*',
            a: 'a',
            b: 'b',
            file: 'file',
            title: 'heading-name',
            headings: [{ text: 'heading-name' }],
          }
        ]);
        done();
      }));
  });

  it('does not error out when one of the keys in the merge is not an object', function(done) {
    pi.fromArray([{ relative: '/a/b/c.md' }])
      .pipe(mergeMeta({
        '*': 'not an object',
        'a/*': true,
        'a/b/*': undefined,
      }))
      .pipe(pi.toArray(function(results) {
        assert.deepEqual(results, [
          {
            relative: '/a/b/c.md'
          }
        ]);
        done();
      }));
  });

});
