var xtend = require('xtend'),
    yaml = require('js-yaml');

var re = /(-{3,}(\n|\r\n))/g;

function parseYamlHeader(file) {
  // supports two formats:
  // 1) --- yaml --- ...
  // 2) yaml --- ...
  var startDelim = /^(-{3,}(\n|\r\n))/.exec(file.contents);
  var start;
  var end;

  re.lastIndex = 0;
  if (startDelim) {
    // format 1: begins with a delimiter
    start = re.exec(file.contents);
    end = re.exec(file.contents);
  } else {
    // format 2: only ending delimiter
    start = { index: 0, 0: '', 1: '' };
    end = re.exec(file.contents);
  }

  if (start && end) {
    var head = file.contents.toString().slice(start.index + start[0].length, end.index);
    var meta = {};
    try {
      meta = yaml.load(head, { filename: file.path });
      file = xtend(file, meta);
      file.contents = file.contents.slice(end.index + end[0].length);
    } catch (e) {
      console.log('Could not parse metadata from ' + file.path);
    }
  }

  return file;
}

module.exports = parseYamlHeader;
