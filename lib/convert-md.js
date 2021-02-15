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

  // custom rendered for headings
  var renderer = new md.marked.Renderer();

  // I wish marked's API would give me direct access to the token in the renderer itself :'(
  // But now that slugger exists, we can just use that I think.
  renderer.heading = function(text, level, raw, slugger) {
    // I think this API is stateful so we should only call it once
    var sluggerId = slugger.slug(raw);
    var id = this.options.headerPrefix + sluggerId;
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

  return md.convertMd({
    renderer: renderer
  });
};
