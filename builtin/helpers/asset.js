var handlebars = require('handlebars');

module.exports = function(context, options) {
  var output = '';
  // data.root is the original item (e.g. the value from the stream)
  // it will have an assetsRelative path from the setOutputPath function
  output += options.data.root.assetsRelative + '/';
  // Get rid of any leading slash on the context
  context = context.replace(/^\//, '');
  output += context;

  return new handlebars.SafeString(output);
};
