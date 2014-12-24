var pi = require('pipe-iterators'),
    Handlebars = require('handlebars');

module.exports = function(opts) {
  Object.keys(opts.partials).forEach(function(partialName){
    Handlebars.registerPartial(partialName, opts.partials[partialName]);
  });

  Object.keys(opts.helpers).forEach(function(helperName){
    Handlebars.registerHelper(helperName, opts.helpers[helperName]);
  });

  return pi.map(function(item) {
    var meta = {};

    item.content = item.content.replace(/<(ul|ol)>/g, '<$1 class="list">')
      .replace("{{&gt;", "{{>")
      .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/mg, '<pre class="prettyprint">$1</pre>')
      .replace(/<p><img([^>]*)>\s*<\/p>/g, '<p class="img-container"><img$1></p>');

    Handlebars.registerPartial('content', content);

    meta.toc = item.toc;

    var template = Handlebars.compile(opts.template);

    item.content = template(meta)
        // allow {{}} via escaping
          .replace(/\\{/g, '{')
          .replace(/\\}/g, '}');

  });
};
