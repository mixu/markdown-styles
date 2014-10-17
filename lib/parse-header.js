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
    var re = /(-{3,}\n)/g,
        start = re.exec(file.contents),
        end,
        head;

    if (start) {
      end = re.exec(file.contents);
    }

    if (start && end) {
      head = file.contents.toString().slice(start.index, end.index);
      try {
//        var meta = JSON.parse(head);
        // parse key: value
        var meta = {};
        head.split('\n').forEach(function(line) {
          var result = /([^:]+):(.*)/.exec(line);
          if (result) {
            meta[result[1].trim()] = result[2].trim();
          }
        });
        file = merge.apply(this, [file].concat(meta));
        file.contents = file.contents.slice(end.index + end[0].length);
      } catch (e) {
        console.log('Could not parse metadata from ' + file.path, e);
      }
    }
    this.push(file);
    onDone();
  });
}

module.exports = parseMetaHeader;
