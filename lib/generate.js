var BookGen = function() { };

BookGen.generate = function(config) {
  // read in the header and footer
  header = fs.readFileSync(config.header).toString();
  footer = fs.readFileSync(config.footer).toString();

  // process the files according to the order array
  var full = config.order.map(function(infile, index) {
    var fullname = path.resolve(config.input+'/'+infile+'.md');
    return BookGen.writeFile({
        filename: fullname,
        prev: config.order[index-1] || 'index',
        next: config.order[index+1],
        index: index
      }, config);
  }).join('');

  // write a single page version as well
  fs.writeFile(config.output+'single.html',
    fs.readFileSync(config.header_single).toString()
          .replace(/{{title}}/g, config.defaults.title)
    + full
    + fs.readFileSync(config.footer_single).toString().replace(/{{title}}/g, config.defaults.title));
};

BookGen.writeFile = function(current, config) {

  console.log(current.filename);
  var tokens = marked.lexer(fs.readFileSync(current.filename).toString());
  var content = marked
                  .parser(tokens)
                  .replace(/<(ul|ol)>/g, '<$1 class="list">')
                  .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/mg, '<pre>$1</pre>')
                  .replace(/<p><img([^>]*)>\s*<\/p>/g, '<p class="img-container"><img$1></p>');

  var title = config.titles[path.basename(current.filename, '.md') ];

  if(!title) {
    title = config.defaults.title;
  }

  content = content.replace(/%chapter_number%/g, current.index);
  fs.writeFileSync(config.output + path.basename(current.filename, '.md') + '.html',
       header
      .replace(/{{title}}/g, title)
      .replace(/{{prev}}/g, current.prev)
      .replace(/{{next}}/g, current.next)
    + content
    + footer
      .replace(/{{title}}/g, title)
      .replace(/{{prev}}/g, current.prev)
      .replace(/{{next}}/g, current.next)
    );

  return content;
};

module.exports = BookGen;
