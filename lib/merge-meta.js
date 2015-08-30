var pi = require('pipe-iterators'),
    xtend = require('xtend'),
    path = require('path');

module.exports = function(meta) {

  return pi.map(function(item) {
    var subpath, newItem = {};
    // split by path.sep for Windows compatibility
    var parts = item.relative.split(path.sep).filter(Boolean);
    // we have exactly as many directories to consider
    // as there are elements in parts
    for (var i = 0; i < parts.length; i++) {
      subpath = parts.slice(0, i).join('/');
      // add a trailing '/' for all but the first one, which is just '*'
      if (i > 0) {
        subpath += '/';
      }
      // each of these corresponds to a directory
      subpath += '*';
      // console.log('index i=' + i + ' subpath=' + subpath);
      if (typeof meta[subpath] === 'object') {
        newItem = xtend(newItem, meta[subpath]);
      }
    }
    // as far as the file itself, we remove trailing .md
    subpath = item.relative.replace(/.md$/, '');
    //console.log("last=" + subpath);
    newItem = xtend(newItem, meta[subpath]);

    // finally inject the data from the file itself
    newItem = xtend(newItem, item);
    // set title from first heading if otherwise missing
    if (!newItem.title && newItem.headings && newItem.headings[0]) {
      newItem.title = newItem.headings[0].text;
    }

    return newItem;
  });
};
