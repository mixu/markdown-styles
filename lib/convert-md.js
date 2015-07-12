var md = require('markdown-stream-utils');

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

  return md.convertMd({
    renderer: renderer
  });
};
