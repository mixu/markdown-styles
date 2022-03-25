function renderInline(tokens) {
  let out = '',
    i,
    token;

  const l = tokens.length;
  for (i = 0; i < l; i++) {
    token = tokens[i];
    switch (token.type) {
      case 'escape':
      case 'html':
      case 'image':
      case 'codespan':
      case 'text':
        out += token.text;
        break;
      case 'link':
      case 'strong':
      case 'em':
      case 'del':
        out += renderInline(token.tokens);
        break;
      case 'br':
        out += '';
        break;
      default: {
        const errMsg = 'Token with "' + token.type + '" type was not found.';
        throw new Error(errMsg);
      }
    }
  }
  return out;
}

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}


module.exports = function addHeadingIds(file) {
  // reset the header counts for each file, so that idCount is not shared across the whole render
  var idCount = {};

  // key for the headings metadata
  file.headings = [];
  // file content is lexer output
  file.contents.forEach(function(token) {
    if (token.type !== 'heading') {
      return token;
    }

    // marked's lexer produces wonky values for heading.text
    // we need to apply the logic that parser.js in marked does to ensure
    // headings don't end up with a lot of text markdown in the text property

    token.text = unescape(renderInline(token.tokens));

    // TODO: this currently matches the logic in Slugger.js
    // in marked -- but it might go out of sync.
    //
    // Ideally, marked would assign ids in the parse stage (or separately)
    // so that we could just read what the IDs are separately, because
    // knowing what the generated IDs will be is useful e.g. for rendering
    // a TOC for a file (before it has been rendered).

    var id = token.text.trim().toLowerCase().replace(/\s+/g, '-');
    // do nothing the first time a heading is seen
    if (!idCount.hasOwnProperty(id)) {
      idCount[id] = 0;
    } else {
      // when duplicate headings are seen, append a dash-number starting with 1
      idCount[id]++;
      id += '-' + idCount[id];
    }
    token.id = id;
    // add to the list of headings as metadata
    file.headings.push(token);
    return token;
  });
  return file;
};

