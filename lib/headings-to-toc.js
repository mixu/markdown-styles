var through = require('through2');

module.exports = function() {

  return through.obj(function headingsToToc(file, enc, onDone) {
    function formatHeading(heading) {
      var result = '<li class="h'+heading.depth+'">';
      // links are either local, or to a full path
      result += '<a href="' + (heading.id.length > 0 ? '#'+heading.id : '')+'">'
      if(heading.depth == 0 || heading.depth == 1) {
        result += '<i class="icon-bookmark"></i>';
      }
      result += heading.text.replace(':', '');
      result += '</a>';
      return result+'</li>';
    }

    file.toc = '<ul class="nav nav-list">' +file.headings.reduce(function(prev, heading) {
      return prev + formatHeading(heading);
    }, '') + '</ul>';

    this.push(file);
    onDone();
  });
};
