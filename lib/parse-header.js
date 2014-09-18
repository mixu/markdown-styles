var through = require('through2');

function parseMetaHeader() {
  function merge(base) {
    var args = Array.prototype.slice.apply(arguments);
    for(var i = 1; i < args.length; i++) {
      if(args[i] instanceof Object) {
        Object.keys(args[i]).forEach(function(key) {
          base[key] = args[i][key];
        });
      }
    }
    return base;
  }

  return through.obj(function (file, enc, onDone) {
    // get the first match
    var result = /(-{3,}\n)/.exec(file.contents),
        head;

    if (result) {
      head = file.contents.toString().slice(0, result.index);
      try {
        file = merge.apply(this, [file].concat(JSON.parse(head)));
        file.contents = file.contents.slice(result.index + result[0].length);
      } catch (e) {
        console.log('Could not parse metadata from ' + file.path);
      }
    }
    this.push(file);
    onDone();
  });
}

module.exports = parseMetaHeader;
