var os = require('os');
var util = require('util');
var Token = require('./token');
var Transform = require('stream').Transform;
util.inherits(Tokenizer, Transform);

var p = Tokenizer.prototype;
p._transform = transform;
p._flush = flush;
p.match = match;
p.matchers = {
  'objectStart': /^(\{)/,
  'objectEnd': /^(\})/,
  'colon': /^(:)/,
  'comma': /^(,)/,
  'arrayStart': /^(\[)/,
  'arrayEnd': /^(\])/,
  'string': /^("((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])*")/,
  'ws': /^(\s)+/,
  'number': /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?)/,
  'true': /^(true)/,
  'false': /^(false)/,
  'null': /^(null)/,
};
p.matcherNames = Object.keys(p.matchers);
p.processChunk = processChunk;

function Tokenizer(options) {
  Transform.call(this, options);
  this.tokens = [];
}

function transform(chunk, encoding, callback) {
  this.processChunk(chunk.utf8Slice());
  callback();
}

function flush(callback) {
  callback();
}

function processChunk(chunk) {
  var i = 0, token, n = chunk.length;
  var match = null;
  for(; i < n; i += token.length) {
    match = this.match(chunk.slice(i));
    token = Token.create(match);
    this.push(token);
  }
}

function match(chunk) {
  var matcher = null;
  var match = null;
  var m = null;
  var i = 0;
  var n = this.matcherNames.length;
  var name = null;
  while( i < n && m === null ) {
    name = this.matcherNames[i];
    matcher = this.matchers[name];
    m = chunk.match(matcher);
    if( m ) {
      var match = m[1];
      return {
        value: match,
        type: name,
        length: match.length
      };
    }
    i += 1;
  }
  return {
    value: chunk[0],
    type: 'error',
    length: 1
  };
}

module.exports = Tokenizer;
