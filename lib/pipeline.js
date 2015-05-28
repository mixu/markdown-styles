var fs = require('fs'),
    pi = require('pipe-iterators'),
    md = require('markdown-stream-utils'),
    setOutputPath = require('./set-output-path'),
    applyTemplate = require('./apply-template'),
    mergeMeta = require('./merge-meta');

module.exports = function(argv) {
  // custom rendered for headings
  var renderer = new md.marked.Renderer();
  // if we want to generate header links, override the default header renderer
  if (argv['header-links']) {
    renderer.heading = function(text, level, raw) {
      var id = this.options.headerPrefix + raw.trim().toLowerCase().replace(/[^\w]+/g, '-');
      return '<h' +
        level +
        ' id="' +
        id +
        '">' +
        '<a class="header-link" href="#' +
        id +
        '"></a>' +
        text +
        '</h' +
        level +
        '>\n';
    };
  }
  return pi.pipeline([
      md.parseHeader(),
      md.parseMd(),
      md.annotateMdHeadings(),
      md.highlight(function(code, lang) {
        if (argv.highlight && typeof argv.highlight[lang] === 'function') {
          return argv.highlight[lang](code, lang);
        }
        return false;
      }),
      md.convertMd({
        renderer: renderer
      }),

      // map paths
      setOutputPath({
        input: argv.input,
        output: argv.output,
        isSingleFile: argv.isSingleFile
      }),

      // merge metadata now that projectName is set
      mergeMeta(
        // load the metadata file if it exists
        fs.existsSync(argv.input + '/meta.json') ?
        require(argv.input + '/meta.json') : {}
      ),

      // apply handlebars templates
      applyTemplate({
        // read the template
        template: fs.readFileSync(argv.layout + '/page.html', 'utf8'),
        partials: fs.existsSync(argv.layout + '/partials') ? argv.layout + '/partials' : [],
        helpers: fs.existsSync(argv.layout + '/helpers') ? argv.layout + '/helpers' : []
      })
  ]);
};
