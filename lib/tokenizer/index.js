'use strict';

var
  util = require('util'),
  Transform = require('stream').Transform,
  _ = require('lodash'),
  Token = require('./token'),
  EmptyStringToken = require('./empty-string-token'),
  ErrorToken = require('./error-token'),
  FalseToken = require('./false-token'),
  NullToken = require('./null-token'),
  NumberToken = require('./number-token'),
  StringToken = require('./string-token'),
  TrueToken = require('./true-token'),
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
  this.length = 0;
  this.errors = [];
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
    var type, matcher, match, opts, capture, i = 0, position = this.position;
    do {
      type = this.matcherNames[i];
      matcher = this.matchers[type];
      match = slice.match(matcher);
      i++;
    } while (match === null && i < this.matcherLength);
    if (match === null) {
      type = 'error';
      opts = {
        column: this.column,
        length: slice.length,
        line: this.line,
        match: match,
        position: position,
        type: type,
        value: slice
      };
    } else {
      capture = match[1];
      opts = {
        column: this.column,
        length: capture.length,
        line: this.line,
        match: match,
        position: position,
        type: type,
        value: capture
      };
    }
    if (opts.type === 'emptyString') opts.type = 'string';
    if (type === 'error') return new ErrorToken(opts);
    if (type === 'emptyString') return new EmptyStringToken(opts);
    if (type === 'string') return new StringToken(opts);
    if (type === 'number') return new NumberToken(opts);
    if (type === 'null') return new NullToken(opts);
    if (type === 'true') return new TrueToken(opts);
    if (type === 'false') return new FalseToken(opts);
    return new Token(opts);
  },

  createToken: function createToken(slice) {
    return this.findMatch(slice);
  },

  processChunk: function processChunk(chunk) {
    if (!chunk || chunk.length === 0) return;
    var token, slice = chunk.slice();
    do {
      this.lastSlice = slice;
      token = this.createToken(slice);
      slice = slice.slice(token.length);
      // as long as we didn't run out of input in this chunk
      if (slice.length > 0) {
        switch (token.type) {
          case 'error':
            this.errors.push(token);
            break;
          case 'nl': break;
          case 'ws': break;
          default:
            this.length += 1;
            this.push(token);
            break;
        }
        if (token.type === 'nl') {
          this.line += 1;
          this.column = 0;
        }
        else {
          this.column += token.length;
        }
        this.emit('token:' + token.type, token);
        this.position += token.length;
      }
    } while (slice.length > 0);
  },

  toString: function toString() {
    return 'Processed ' + this.length + ' tokens. ' + this.errors.length + ' errors.\n' + this.errorStrings().join('\n');
  },

  errorStrings: function errorStrings() {
    return this.errors.map(function(token) {
      return token.toErrorString();
    });
  }

});
