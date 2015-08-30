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

    var layoutDir = fixture.dir({
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
        layout: layoutDir
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
        layout: layoutDir
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"Some title" by ',
            '<h1 id="some-title">Some title</h1>',
            '<p>abcdef</p>\n'
          ].join('\n'));
        done();
      });
    });

    it('If there is no first heading, the file name is used (without the file extension)');

    it('reads and scopes the meta.json based on the path relative to target directory', function(done) {
      var dir = fixture.dir({
        'meta.json': JSON.stringify({
          '*': { cascade: 'value-from-*' },
          foo: { cascade: 'value-from-key-foo' },
          'foo/*': { cascade: 'value-from-key-foo-*' },
          'abc/bar': { cascade: 'value-from-key-abc/bar' },
          'abc/bar/baz/*': { cascade: 'value-from-key-abc-bar-baz-*' }
        }),
        'foo.md': 'file: foo.md\nbase: keep\n---\nfoo.md', // components: *, foo
        'foo/bar.md': 'file: foo/bar.md\n---\nfoo/bar.md', // components: *, foo, bar
        'abc/bar.md': 'file: abc/bar.md\n---\nabc/bar.md', // components: *, abc, bar
        'abc/bar/baz.md': 'file: abc/bar/baz.md\n---\nabc/bar/baz.md', // components: *, abc, bar, baz
        'abc/bar/baz/foo.md': 'file: abc/bar/baz/foo.md\n---\nabc/bar/baz.md' // components: *, abc, bar, baz, foo
      });

      var layoutDir = fixture.dir({
        'page.html': '"{{file}}","{{cascade}}","{{base}}"\n{{> content}}'
      });
      var out = fixture.dirname();

      mds.render({
        input: dir,
        output: out,
        layout: layoutDir
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
            '"foo.md","value-from-key-foo","keep"',
            '<p>foo.md</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/foo/bar.html', 'utf8'), [
            '"foo/bar.md","value-from-key-foo-*",""',
            '<p>foo/bar.md</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/abc/bar.html', 'utf8'), [
            '"abc/bar.md","value-from-key-abc/bar",""',
            '<p>abc/bar.md</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/abc/bar/baz.html', 'utf8'), [
            '"abc/bar/baz.md","value-from-*",""',
            '<p>abc/bar/baz.md</p>\n'
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/abc/bar/baz/foo.html', 'utf8'), [
            '"abc/bar/baz/foo.md","value-from-key-abc-bar-baz-*",""',
            '<p>abc/bar/baz.md</p>\n'
          ].join('\n'));
        done();
      });
    });

    it('when the same header is repeated, ' +
      'the header links are unique (within a particular file, but not across the render)', function(done) {
      var dir = fixture.dir({
        'foo.md': [
          '# some heading',
          'hello',
          '# some heading',
        ].join('\n'),
        'bar.md': [
          '# some heading',
          'hello',
          '# some heading',
        ].join('\n')
      });
      var out = fixture.dirname();

      var layoutDir = fixture.dir({
        'page.html': '{{> content}}'
      });

      mds.render({
        input: dir,
        output: out,
        layout: layoutDir
      }, function() {
        assert.equal(fs.readFileSync(out + '/foo.html', 'utf8'), [
          '<h1 id="some-heading">some heading</h1>',
          '<p>hello</p>',
          '<h1 id="some-heading-1">some heading</h1>',
          ''
          ].join('\n'));
        assert.equal(fs.readFileSync(out + '/bar.html', 'utf8'), [
          '<h1 id="some-heading">some heading</h1>',
          '<p>hello</p>',
          '<h1 id="some-heading-1">some heading</h1>',
          ''
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
          mds.convertMd(),

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
          '<h1 id="foo"><a class="header-link" href="#foo"></a>foo</h1>',
          '<pre class="hljs"><code>' +
          '<span class="hljs-keyword">var</span> foo = bar;</code></pre>b'
        ].join('\n'));
        done();
      });
    });

    it('when the same header text is repeated, it produces ids with a number appended to them', function(done) {
      render({ contents: [
        '# some heading',
        'hello',
        '# some heading',
        'world',
        '# some heading',
      ].join('\n') }, {
        template: '{{> content}}'
      }, function(html) {
        assert.equal(html, [
          '<h1 id="some-heading"><a class="header-link" href="#some-heading"></a>some heading</h1>',
          '<p>hello</p>',
          '<h1 id="some-heading-1"><a class="header-link" href="#some-heading-1"></a>some heading</h1>',
          '<p>world</p>',
          '<h1 id="some-heading-2"><a class="header-link" href="#some-heading-2"></a>some heading</h1>',
          ''
        ].join('\n'));
        done();
      });
    });
  });
});
