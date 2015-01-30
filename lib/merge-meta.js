var pi = require('pipe-iterators'),
    xtend = require('xtend');

module.exports = function(meta) {

  return pi.map(function(item) {
    item = xtend(item, meta[item.projectName] ? meta[item.projectName] : {});

    if (!item.title && item.headings && item.headings[0]) {
      item.title = item.headings[0].text;
    }

    return item;
  });
};
