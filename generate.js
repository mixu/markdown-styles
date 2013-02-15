var fs = require('fs'),
    path = require('path'),
    existsSync = (fs.existsSync ? fs.existsSync : path.existsSync),
    marked = require('marked'),
    util = require('util');

var header = '',
    footer = '';


var defaults = {

  input: __dirname + '/input/',

  defaults: {
    title: 'Markdown stylesheets'
  },

  order: fs.readdirSync('./input/').map(function(filename) { return path.basename(filename, '.md'); }).sort(),

  titles: {
    index: 'example',
  }
};

function clone(object) {
    var cloned = Object.create(object.prototype || null);
    Object.keys(object).map(function (i) {
        cloned[i] = object[i];
    });

    return cloned;
}


fs.readdirSync('./output/')
  .filter(function(filename) { return fs.statSync(__dirname + '/output/' + filename).isDirectory(); })
  .forEach(function(style) {
    console.log(style);

    var settings = clone(defaults);

    settings.output = __dirname + '/output/'+style+'/';
    if(existsSync(__dirname + '/layouts/'+style+'/header.html')) {
      settings.header = settings.header_single = __dirname + '/layouts/'+style+'/header.html';
      settings.footer = settings.footer_single = __dirname + '/layouts/'+style+'/footer.html';
    } else {
      settings.header = settings.header_single = __dirname + '/layouts/plain/header.html';
      settings.footer = settings.footer_single = __dirname + '/layouts/plain/footer.html';
    }

    BookGen.generate(settings);
  });


