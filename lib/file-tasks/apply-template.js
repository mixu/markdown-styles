var Transform = require('readable-stream').Transform;

function replace(items, str) {
  var result = str;
  Object.keys(items).forEach(function(key) {
    result = result.replace(new RegExp('{{'+key+'}}', 'g'), items[key]);
  });
  return result;
}

function Wrap(options) {
  Transform.call(this, options);
  this.options = options;
  this.buffer = '';
}

// this is just the recommended boilerplate from the Node core docs
Wrap.prototype = Object.create(Transform.prototype, { constructor: { value: Wrap }});

Wrap.prototype._transform = function(chunk, encoding, done) {
  // we need to accumulate the output
  this.buffer += chunk;
  done();
};

Wrap.prototype._flush = function(done) {
  // at the end of input, process the whole stream
  this.options.meta.content = this.buffer;

  this.push(
    replace(this.options.meta, this.options.template)
      .replace(/<(ul|ol)>/g, '<$1 class="list">')
      .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/mg, '<pre>$1</pre>')
      .replace(/<p><img([^>]*)>\s*<\/p>/g, '<p class="img-container"><img$1></p>')
    );
  this.buffer = '';
  done();
};

module.exports = function(options) {
  var instance = new Wrap(options);
  // since it's a duplex stream, let the stdin and stdout point to the same thing
  return {
    stdin: instance,
    stdout: instance
  };
};
