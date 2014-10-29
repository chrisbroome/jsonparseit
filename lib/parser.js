'use strict';
var
  _ = require('lodash');

module.exports = Parser;

function Parser(options) {
  var opts = options || {};
  this.tokenizer = opts.tokenizer;
  this._errors = [];
  this._tokens = [];
  this._tokenPointer = 0;
  this._ignoreTokens = ['ws', 'nl'];
  this.treeRoot = null;
  this.tokenizer.on('data', this.parseToken.bind(this));
  this.tokenizer.on('end', this.parseTokens.bind(this));
}
_.extend(Parser.prototype, {

  error: function(message) {
    this._errors.push({message: message});
    return this;
  },

  // advances the iterator
  next: function next() {
    this._tokenPointer += 1;
    return this;
  },

  getErrors: function getErrors() {
    return this._errors;
  },

  ignoreTokens: function ignoreTokens(tokenType) {
    return this._ignoreTokens.indexOf(tokenType) >= 0;
  },

  currentToken: function currentToken() {
    return this._tokens[this._tokenPointer];
  },

  peek: function peek() {
    return this._tokens[this._tokenPointer + 1];
  },

  getCurrentPair: function getCurrentPair() {
    var
      token = this.currentToken(),
      peek = this.peek();
    return {token: token, peek: peek};
  },

  getNextPair: function getNextPair() {
    this.next();
    return this.getCurrentPair();
  },

  parseTokens: function parseTokens() {
    this.treeRoot = this.value();
  },

  parseToken: function parseToken(token) {
    if (!this.ignoreTokens(token.type)) this._tokens.push(token);
    return this;
  },

  object: function object() {
    return this.parseNested('object', '{', '}', 'objectMembers', 'object without trailing brace');
  },

  objectMembers: function objectMembers() {
    return this.parseList('objectMembers', 'objectPair', ',');
  },

  objectPair: function objectPair() {
    var key = this.objectKey();
    var sep = this.parseTerminal(':');
    var value = this.value();
    return {type: 'pair', sep: sep, key: key, value: value};
  },

  objectKey: function objectKey() {
    var key = this.parseTerminal('string');
    return {type: 'objectKey', value: key};
  },

  value: function value() {
    var cp = this.getCurrentPair(), type = cp.token.type;
    switch (type) {
      case 'true':
      case 'false':
      case 'null':
      case 'string':
      case 'number':
        return this.parseTerminal(type);
      case '{':
        return this.object();
      case '[':
        return this.array();
      default:
        this.error('invalid value');
        return {type: 'error', value: 'invalid value'};
    }
  },

  array: function array() {
    return this.parseNested('array', '[', ']', 'arrayMembers', 'array without trailing bracket');
  },

  arrayMembers: function arrayMembers() {
    return this.parseList('arrayMembers', 'value', ',');
  },

  parseNested: function parseNested(nodeType, open, close, nestedHandler, errorMessage) {
    var
      o = this.parseTerminal(open),
      cp = this.getCurrentPair(),
      nextToken = cp.token,
      node = {type: nodeType, open: o, close: null, children: null};
    if (!nextToken) {
      this.error(errorMessage);
      return node;
    }
    if (nextToken.type !== close) {
      node.children = this[nestedHandler]();
    }
    node.close = this.parseTerminal(close);
    return node;
  },

  parseList: function parseList(nodeType, memberHandler, separator) {
    var members = [], cp, notDone = true;
    do {
      members.push(this[memberHandler]());
      cp = this.getCurrentPair();
      notDone = cp.token.type === separator;
      if (notDone) this.parseTerminal(separator);
    } while(notDone);
    return {type: nodeType, value: members};
  },

  parseTerminal: function parseTerminal(type) {
    var
      cp = this.getCurrentPair(),
      token = cp.token;
    if (token.type !== type) this.error(token.toString() + ': expected a ' + type + '. actual type seen was ' + token.type);
    this.getNextPair();
    return {type: token.type, value: token.value, originalValue: token.originalValue};
  }

});
