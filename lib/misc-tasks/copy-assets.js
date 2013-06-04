var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp').ncp;

function copyAssets(from, to) {
  var copied = [];
  // check whether assets folder exists
  if(fs.existsSync(from)) {
    ncp.limit = 16;
    ncp(from, to, {
      filter: function(file) {
        copied.push(file);
        return true;
        }
      },
    function (err) {
     if (err) {
       return console.error(err);
     }
      console.log('Copied assets:\n'+
        copied
          .map(function(name) { return path.relative(process.cwd(), name); })
          .filter(function(name) { return !!name; })
          .map(function(name) { return '\t' + name; })
          .sort(function(a, b) { return a.localeCompare(b); })
          .join('\n')
        );
    });
  } else {
    console.log('Assets path does not exist: ' + from + ', so no assets were copied.');
  }
}

module.exports = copyAssets;
