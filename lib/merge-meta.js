var pi = require('pipe-iterators'),
    xtend = require('xtend');

// a function similar to python's update
// no need to copy as first dict always starts from a fresh one
// also allow an undefined d2
dictUpdate = function(d1, d2) {
  if (d2)
    for (var k in d2)
      d1[k] = d2[k]
}


module.exports = function(meta) {

  return pi.map(function(item) {
    var newItem = {};
    var path = item.relative.split("/");
    var l = path.length;
    // we have exactly as many directories to consider
    // as there are elements in path
    for (var i=0; i<l; i++) {
      var subpath = path.slice(0,i).join("/");
      // add a trailing '/' for all but the first one
      if (subpath) subpath += "/";
      // each of these corresponds to a directory
      subpath += "*";
      //console.log("index i=" + i + " subpath=" + subpath);
      dictUpdate(newItem, meta[subpath]);
    }
    // as far as the file itself, we remove trailing .md
    var subpath = item.relative.replace(/.md$/, '');
    //console.log("last=" + subpath);
    dictUpdate(newItem, meta[subpath]);

    // finally inject the data from the file itself
    dictUpdate(newItem, item)
    // set title from first heading if otherwise missing 
    if (!newItem.title && newItem.headings && newItem.headings[0]) {
      newItem.title = newItem.headings[0].text;
    }

    return newItem;
  });
};
