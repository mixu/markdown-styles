var https = require('https'),
    child_process = require('child_process');

https.get('https://api.github.com/repos/w0ng/googlefontdirectory/contents/fonts', function(res) {
  console.log("Got response: " + res.statusCode);
  var data = '';
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function() {
    var content = JSON.parse(data);

    ['Andika', 'Cantarell', 'DroidSansMono', 'Vollkorn', 'PT_Sans', 'Inconsolata'].forEach(function(font) {
      var items = content.filter(function(item) {
        return item.name.match(font);
      });
      console.log('Run the following commands to get the fonts');
      items.forEach(function(item) {
        console.log('cd ~/.fonts && wget -N https://github.com/w0ng/googlefontdirectory/raw/master/'+item.path);
      });
      console.log('fc-cache -fv')
    });
  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
