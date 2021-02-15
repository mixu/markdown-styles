var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    fixture = require('file-fixture'),
    mds = require('../');

var layouts = fs.readdirSync(__dirname + '/../layouts');
var layoutDir = path.normalize(__dirname + '/../layouts/');
var customLayout;
var sampleInput;

describe('api tests', function() {

  before(function() {
    customLayout = fixture.dir({
      'assets/css/style.css': 'style',
      'partials/foo.hdbs': '<p>foo</p>',
      'helpers/bar.js': [
        'module.exports = function(context, opts) {',
        '  return "barHelper " + context;',
        '};'
      ],
      'page.html': '{{> foo}}{{bar "baz"}}{{~> content}}'
    });
    sampleInput = fixture.dir({
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

  it('--input defaults to process.cwd() + ./input', function() {
    assert.strictEqual(mds.resolveArgs({ }).input, process.cwd() + '/input');
    assert.strictEqual(mds.resolveArgs({ input: 'foo' }).input, process.cwd() + '/foo');
    assert.strictEqual(mds.resolveArgs({ input: './foo' }).input, process.cwd() + '/foo');
  });

  it('--output defaults to process.cwd() + ./output', function() {
    assert.strictEqual(mds.resolveArgs({ }).output, process.cwd() + '/output');
    assert.strictEqual(mds.resolveArgs({ output: 'foo' }).output, process.cwd() + '/foo');
    assert.strictEqual(mds.resolveArgs({ output: './foo' }).output, process.cwd() + '/foo');
  });

  it('--layout specifies the layout to use', function() {
    assert.strictEqual(mds.resolveArgs({ }).layout, layoutDir + 'github/');
    assert.strictEqual(mds.resolveArgs({ layout: 'roryg-ghostwriter' }).layout, layoutDir + 'roryg-ghostwriter/');
  });

  it('loads page.html, assets, partials and helpers given --layout', function(done) {
    var out = fixture.dirname();
    sampleInput = fixture.dir({
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
    mds.render(mds.resolveArgs({
      input: sampleInput,
      output: out,
      layout: customLayout
    }), function() {
      // check that the helper ran
      // check that the partial ran
      // check that the assets were copied
      // check that the output is as expected
      console.log('custom layout', customLayout, out);
      done();
    });
  });

  it('--export exports the layout to a directory', function(done) {
    var out = fixture.dirname();
    mds.render(mds.resolveArgs({
      'export': 'github',
      output: out
    }), function() {
      // check that the assets, helpers and partials were copied
      done();
    });
  });

  it('--highlight-lang module enables a highlighter', function(done) {
    var out = fixture.dirname();
    mds.render(mds.resolveArgs({
      input: sampleInput,
      output: out,
      layout: customLayout
    }), function() {
      // check that the custom js highlighter ran
      console.log('--highlight-lang', customLayout, out);
      done();
    });
  });

  it('has a render(opts, onDone) function that works like bin/generate-md', function(done) {

    // params:
    // input
    // output
    // template
    // partials
    // helpers
    // layout
    // assetDir
    done();
  });

  it('has a pipeline(opts) function that returns a pipeline that accepts items', function(done) {

    // params:
    // input
    // output
    // template
    // partials
    // helpers
    done();
  });

/*
    it('supports custom syntax highlighters for specific languages', function(done) {

      var dir = fixture.dir({
        'foo.md': [
        '# foo',
        '',
        '```csv',
        'abc,def,ghi',
        '```'
        ].join('\n')
      });
      var out = fixture.dirname();

      mds.render({
        input: dir,
        output: out,
        template: templateDir + '/page.html'
      }, function() {
        assert.strictEqual(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"Some title" by ',
            '<h1 id="some-title">Some title</h1>',
            '<p>abcdef</p>\n'
          ].join('\n'));
        done();
      });


function(code, lang) {
      if (lang === 'csv') {
        return mdsCsv(code, lang);
      }
      return false;
    }

      done();
    });

  });
*/
});

/*
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
      done();
    });
  }

  layouts.forEach(function(layout) {
    it('can render layout ' + layout, function(done) { render(layout, done); });
  });

});
*/
