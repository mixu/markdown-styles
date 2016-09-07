var url = require('url'),
    path = require('path'),
    pi = require('pipe-iterators'),
    md = require('markdown-stream-utils');

// A wrapper around md.convertMd that includes the custom heading generation and id
// generation code.
module.exports = function(argv) {
  if (!argv) {
    // default to true to match bin/generate-md
    argv = { 'header-links': true };
  }

  // header ids already seen in the current render
  var idCount = {};
  // custom rendered for headings
  var renderer = new md.marked.Renderer();
  renderer.heading = function(text, level, raw) {
    var id = this.options.headerPrefix + raw.trim().toLowerCase().replace(/[^\w]+/g, '-');
    // do nothing the first time a heading is seen
    if (!idCount.hasOwnProperty(id)) {
      idCount[id] = 0;
    } else {
      // when duplicate headings are seen, append a dash-number starting with 1
      idCount[id]++;
      id += '-' + idCount[id];
    }
    return '<h' +
      level +
      ' id="' +
      id +
      '">' +
      // if we want to generate header links, add the <a> link
      (argv['header-links'] ?
        '<a class="header-link" href="#' + id + '"></a>' : '') +
      text +
      '</h' +
      level +
      '>\n';
  };

  renderer.link = function(href, title, text) {
    if (this.options.sanitize) {
      try {
       var prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return '';
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
        return '';
      }
    }
    var parsed = url.parse(href);
    // convert [.md] in local links (e.g. links with no protocol)
    if (!parsed.protocol) {
      var ext = path.extname(parsed.pathname || '');
      if (ext === '.markdown' ||
          ext === '.mdown' ||
          ext === '.mkd' ||
          ext === '.mkdn' ||
          ext === '.md') {
        var dirname = path.dirname(parsed.pathname);
        parsed.pathname = dirname +
              (dirname.charAt(dirname.length - 1) === '/' ? '' : '/') +
              path.basename(parsed.pathname, ext) + '.html';
        href = url.format(parsed);
      }
    }

    var out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  // reset the header counts for each file, so that idCount is not shared across the whole render
  return pi.pipeline([
    pi.forEach(function() {
      idCount = {};
    }),
    md.convertMd({
      renderer: renderer
    })
  ]);
};
