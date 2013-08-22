var os = require('os');
var util = require('util');
var Token = require('./token');
var Transform = require('stream').Transform;
util.inherits(Tokenizer, Transform);

var p = Tokenizer.prototype;
p._transform = transform;
p._flush = flush;
p.position = 0;
p.match = match;
p.matchers = {
  'objectStart': /^(\{)/,
  'objectEnd': /^(\})/,
  'colon': /^(:)/,
  'comma': /^(,)/,
  'arrayStart': /^(\[)/,
  'arrayEnd': /^(\])/,
  'true': /^(true)/,
  'false': /^(false)/,
  'null': /^(null)/,
  'ws': /^(\s+)/,
  'number': /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?)/,
  'emptyString': /^("")/,
  'nonEmptyString': /^("((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+")/,
  'nonTerminatedString': /^("((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+)/,
  'nonInitiatedString': /^(((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+")/,
};
p.matcherNames = Object.keys(p.matchers);
p.processChunk = processChunk;

function Tokenizer(options) {
  options = options || {};
  options.objectMode = true;
  Transform.call(this, options);
  this.tokens = [];
  this.position = 0;
  this.temp = '';
}

function transform(chunk, encoding, callback) {
  this.processChunk(this.temp + chunk.utf8Slice());
  callback();
}

function flush(callback) {
  callback();
}

function processChunk(chunk) {
  var i = 0, token, n = chunk.length;
  var match = null;
  var slice = null;
  while( i < n ) {
    slice = chunk.slice(i);
    match = this.match(slice);
    if( i + match.length >= n ) {
      this.temp = slice;
      break;
    }
    token = Token.create(match);
    i += token.length;
    this.position += token.length;
    this.push(token);
    this.emit('token', token);
  }
}

function match(chunk) {
  var position = this.position;
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
      var token = Token.create({
        value: match,
        type: name,
        length: match.length,
        position: position
      });
      return token;
    }
    i += 1;
  }
  return Token.create({
    value: chunk[0],
    type: 'error',
    length: 1,
    position: position
  });
}

module.exports = Tokenizer;
