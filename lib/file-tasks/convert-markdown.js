// use readable-stream to use Node 0.10.x streams in Node 0.8.x
var Transform = require('readable-stream').Transform,
    marked = require('marked'),
    hljs;

try {
  hljs = require('highlight.js');
  console.log('\nUsing highlight.js for code highlighting..\n');
} catch(e) { }

function Wrap(options) {
  Transform.call(this, options);
  this.buffer = '';
}

// this is just the recommended boilerplate from the Node core docs
Wrap.prototype = Object.create(Transform.prototype, { constructor: { value: Wrap }});

Wrap.prototype._transform = function(chunk, encoding, done) {
  // marked cannot stream input, so we need to accumulate it here.
  this.buffer += chunk;
  done();
};

Wrap.prototype._flush = function(done) {
  // at the end of input, process the whole stream via the marked markdown parser
  var tokens = marked.lexer(this.buffer);

  if(hljs) {
    tokens.forEach(function(token, index) {
      if(token.type == 'code') {
        if(token.lang) {
          tokens[index] = {
            type: 'html',
            pre: false,
            text: '<pre class="hljs"><code class="'+ token.lang +'">' +
                  hljs.highlight(token.lang, token.text).value +
                  '</code></pre>'
          };
        } else {
          tokens[index] = {
            type: 'html',
            pre: false,
            text: '<pre class="hljs"><code>' + hljs.highlightAuto(token.text).value + '</code></pre>'
          };
        }
      }
    });
  }

  this.push(marked.parser(tokens));
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
