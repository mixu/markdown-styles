var assert = require('assert'),
    fs = require('fs'),
    pi = require('pipe-iterators'),
    xtend = require('xtend'),
    applyTemplate = require('../lib/apply-template'),
    setOutputPath = require('../lib/set-output-path'),
    md = require('markdown-stream-utils'),
    fixture = require('file-fixture'),
    mds = require('../');

describe('integration tests', function() {

  describe('metadata tests', function() {

    var templateDir = fixture.dir({
      'page.html': '"{{title}}" by {{author}}\n{{> content}}'
    });

    it('reads and renders metadata stored in a file', function(done) {
      var dir = fixture.dir({
        'foo.md': [
          'title: Hello world',
          'author: Anonymous',
          '----',
          '# Test',
          'abcdef'
        ].join('\n')
      });

      var out = fixture.dirname();

      mds.render({
        input: dir,
        output: out,
        template: templateDir + '/page.html'
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"Hello world" by Anonymous',
            '<h1 id="test">Test</h1>',
            '<p>abcdef</p>\n'
          ].join('\n'));
        done();
      });
    });

    it('will implicitly pick up the first heading as the title if no meta title is set', function(done) {
      var dir = fixture.dir({
        'foo.md': [
          '# Some title',
          'abcdef'
        ].join('\n')
      });
      var out = fixture.dirname();

      mds.render({
        input: dir,
        output: out,
        template: templateDir + '/page.html'
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"Some title" by ',
            '<h1 id="some-title">Some title</h1>',
            '<p>abcdef</p>\n'
          ].join('\n'));
        done();
      });
    });

    it('reads and scopes the meta.json based on the path relative to target directory', function(done) {
      var dir = fixture.dir({
        'meta.json': JSON.stringify({
          foo: { pn: 'foo' },
          'abc/bar': { pn: 'abc/bar' }
        }),
        'foo.md': 'foo', // projectName foo
        'foo/bar.md': 'bar', // projectName foo
        'abc/bar/baz.md': 'baz', // projectName abc/bar
      });

      var templateDir = fixture.dir({
        'page.html': '"{{pn}}"\n{{> content}}'
      });
      var out = fixture.dirname();

      mds.render({
        input: dir,
        output: out,
        template: templateDir + '/page.html'
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"foo"',
            '<p>foo</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/foo/bar.html', 'utf8'), [
            '"foo"',
            '<p>bar</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/abc/bar/baz.html', 'utf8'), [
            '"abc/bar"',
            '<p>baz</p>\n'
          ].join('\n'));
        done();
      });
    });

  });

  describe('theme tests', function() {

    function render(item, opts, onDone) {
      pi.fromArray([
        xtend({ path: '/fake/input/index.md' }, item)
      ])
        .pipe(pi.head([
          md.parseHeader(),
          md.parseMd(),
          md.annotateMdHeadings(),
          md.highlight(),
          md.convertMd(),

          setOutputPath({
            input: '/fake/input',
            output: '/fake/output',
            assetDir: '/fake/output/assets/'
          }),

          applyTemplate(opts),

          pi.toArray(function(results) {
            onDone(results[0].contents);
          })
        ]));
    }

    it('renders {{> content}}', function(done) {
      render({ contents: 'Hello world' }, { template: 'a{{> content}}b' }, function(html) {
        assert.equal(html, 'a<p>Hello world</p>\nb');
        done();
      });
    });

    it('renders {{title}}', function(done) {
      render({ title: 'foo', contents: 'a' }, { template: 'a{{title}}b' }, function(html) {
        assert.equal(html, 'afoob');
        done();
      });
    });

    it('renders {{> toc}}', function(done) {
      render({ contents: [
        'a',
        '# foo',
        'b',
        '## bar',
        'c'
      ].join('\n')
      }, { template: 'a{{> toc}}b' }, function(html) {
        assert.equal(html, [
          'a<ul class="nav nav-list">',
          '    <li><a href="#foo">foo</a></li>',
          '    <li><a href="#bar">bar</a></li>',
          '</ul>',
          'b'
        ].join('\n'));
        done();
      });
    });

    it('renders {{asset "css/style.css"}}', function(done) {
      render({ contents: 'a' }, { template: 'src="{{asset "css/style.css"}}"' }, function(html) {
        assert.equal(html, 'src="assets/css/style.css"');
        done();
      });
    });

    it('renders partials via {{> partialName}}', function(done) {
      render({ contents: 'a' }, {
        template: 'a{{> sample-partial}}b',
        partials: __dirname + '/fixtures/partials'
      }, function(html) {
        assert.equal(html, 'aSample partial\nb');
        done();
      });
    });

    it('can override base partial such as {{> toc}}', function(done) {
      render({ contents: [
        'a',
        '# foo',
        'b',
        '## bar',
        'c'
      ].join('\n') }, {
        template: 'a{{> toc}}b',
        partials: __dirname + '/fixtures/partials'
      }, function(html) {
        assert.equal(html, [
            'aTOC:',
            '  - Hello foo!',
            '  - Hello bar!',
            'b'
          ].join('\n'));
        done();
      });
    });

    it('loads helpers from the helpers directory', function(done) {
      render({ contents: 'a' }, {
        template: 'a{{sample-helper "world"}}b',
        helpers: __dirname + '/fixtures/helpers'
      }, function(html) {
        assert.equal(html, 'aHello world!b');
        done();
      });
    });

    it('renders code with syntax highlighting', function(done) {
      render({ contents: [
        'a',
        '# foo',
        '',
        '```js',
        'var foo = bar;',
        '```'
      ].join('\n') }, {
        template: 'a{{> content}}b'
      }, function(html) {
        assert.equal(html, [
          'a<p>a</p>',
          '<h1 id="foo">foo</h1>',
          '<pre class="hljs"><code>' +
          '<span class="hljs-keyword">var</span> foo = bar;</code></pre>b',
        ].join('\n'));
        done();
      });
    });

    it('supports custom syntax highlighters for specific languages', function(done) {
      done();
    });

  });


});
