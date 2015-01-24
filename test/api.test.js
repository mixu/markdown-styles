var fs = require('fs'),
    path = require('path'),
    fixture = require('file-fixture'),
    mds = require('../');

var layouts = fs.readdirSync(__dirname + '/../layouts');


/*
  it('has a render(opts, onDone) function that works like bin/generate-md', function(done) {

    // params:
    // input
    // output
    // template
    // partials
    // helpers
    // layout
    // assetDir

  });

  it('has a pipeline(opts) function that returns a pipeline that accepts items', function(done) {

    // params:
    // input
    // output
    // template
    // partials
    // helpers

  });

*/

describe('can render every sample layout', function() {
  var dir;

  before(function() {
    dir = fixture.dir({
      'index.md': [
        'title: Hello world',
        'author: Anonymous',
        '----',
        '# Test',
        '```js',
        'var foo = "bar";',
        '```'
      ].join('\n')
    });

  });

  function render(layout, done) {
    var out = fixture.dirname();

    mds.render(mds.resolveArgs({
      input: dir,
      output: out,
      layout: layout
    }), function() {
      // console.log(layout, out);
      /*
      assert.equal(fs.readFileSync(out + '/index.html', 'utf8'), [
          '"Hello world" by Anonymous',
          '<h1 id="test">Test</h1>',
          '<p>abcdef</p>\n'
        ].join('\n'));
      */
      done();
    });
  }

  layouts.forEach(function(layout) {
    it('can render layout ' + layout, function(done) { render(layout, done); });
  });

});
