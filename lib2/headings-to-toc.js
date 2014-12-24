'<ul class="nav nav-list">' +
      item.headings.reduce(function(prev, item) {
        return prev + '<li><a href="#'+item.id+'">'+item.title.replace(':', '')+'</a></li>';
      }, '') + '</ul>'
