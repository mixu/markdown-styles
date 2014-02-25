// use readable-stream to use Node 0.10.x streams in Node 0.8.x
var Transform = require('readable-stream').Transform,
    marked = require('marked');

function Wrap(options) {
  Transform.call(this, options);
  this.buffer = '';
  this.highlight = (options && options.highlight ? options.highlight : {});
}

// this is just the recommended boilerplate from the Node core docs
Wrap.prototype = Object.create(Transform.prototype, { constructor: { value: Wrap }});

Wrap.prototype._transform = function(chunk, encoding, done) {
  // marked cannot stream input, so we need to accumulate it here.
  this.buffer += chunk;
  done();
};

function callHighlighter(fn, code, lang, index, tasks, tokens) {
  if(fn.length == 2) {
    tokens[index] = {
      type: 'html',
      pre: false,
      text: fn(code, lang)
    };
  } else {
    // queue
    tasks.push(function(done) {
      fn(code, lang, function(err, html) {
        if(err) {
          throw err;
        }
        tokens[index] = {
          type: 'html',
          pre: false,
          text: result
        };
        done();
      });
    });
  }
}

Wrap.prototype._flush = function(done) {
  // at the end of input, process the whole stream via the marked markdown parser
  var self = this,
      tokens = marked.lexer(this.buffer),
      tasks = [];

  var async = require('async');

  tokens.forEach(function(token, index) {
    if(token.type != 'code') {
      return;
    }

    // call appropriate highlighter
    if(self.highlight && self.highlight[token.lang]) {
      // is there a specific handler that uses this language
      return callHighlighter(self.highlight[token.lang],
        token.text, token.lang, index, tasks, tokens);
    }
    // call the default highlighter
    if(self.highlight && self.highlight['default']) {
      callHighlighter(self.highlight['default'],
        token.text, token.lang, index, tasks, tokens);
    }
  });
  async.series(tasks, function() {
    self.push(marked.parser(tokens));
    self.buffer = '';
    done();
  });
};

module.exports = function(options) {
  var instance = new Wrap(options);
  // since it's a duplex stream, let the stdin and stdout point to the same thing
  return {
    stdin: instance,
    stdout: instance
  };
};
