'use strict';

var
  util = require('util'),
  Transform = require('stream').Transform,
  _ = require('lodash'),
  Token = require('./token'),
  matchers = require('./matchers'),
  matcherNames = _.keys(matchers),
  matcherLength = matcherNames.length;

module.exports = Tokenizer;

util.inherits(Tokenizer, Transform);

function Tokenizer(options) {
  var opts = options || {};
  opts.objectMode = true;
  Transform.call(this, opts);
  this.lastSlice = '';
  this.position = 0;
  this.line = 1;
  this.column = 0;
  this.matcherNames = matcherNames;
  this.matchers = matchers;
  this.matcherLength = matcherLength;
}

_.extend(Tokenizer.prototype, {
  _flush: function flush(cb) {
    var slice = this.lastSlice;
    this.processChunk(slice);
    cb();
  },

  _transform: function transform(chunk, encoding, cb) {
    var slice = this.lastSlice + chunk.slice();
    this.processChunk(slice);
    cb();
  },

  // instance methods
  findMatch: function findMatch(slice) {
    var name, matcher, match, i = 0, position = this.position;
    do {
      name = this.matcherNames[i];
      matcher = this.matchers[name];
      match = slice.match(matcher);
      i++;
    } while (match === null && i < this.matcherLength);
    if (match === null) {
      return {
        column: this.column,
        length: slice.length,
        line: this.line,
        position: position,
        type: 'error',
        value: slice
      };
    }
    var capture = match[1];
    return {
      column: this.column,
      length: capture.length,
      line: this.line,
      position: position,
      type: name,
      value: capture
    };
  },

  createToken: function createToken(slice) {
    var match = this.findMatch(slice);
    return new Token(match);
  },

  processChunk: function processChunk(chunk) {
    if (!chunk || chunk.length === 0) return;
    var token, slice = chunk.slice();
    do {
      token = this.createToken(slice);
      if (token.type === 'nl') {
        this.line += 1;
        this.column = 0;
      }
      else if (token.type === 'error') {
      }
      else {
        this.push(token);
      }
      this.emit('token:' + token.type, token);
      this.position += token.length;
      this.column += token.length;
      this.lastSlice = slice;
      slice = slice.slice(token.length);
    } while (slice.length > 0);
  }

});
