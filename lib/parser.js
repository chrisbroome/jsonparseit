'use strict';
var
  _ = require('lodash'),
  errors = require('./parser/errors');

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

  error: function error(err) {
    this._errors.push(err);
    return false;
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
    this.assertEndOfInput();
  },

  parseToken: function parseToken(token) {
    if (!this.ignoreTokens(token.type)) this._tokens.push(token);
    return this;
  },

  object: function object() {
    return this.parseNested('object', '{', '}', 'objectMembers');
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
    var token = this.currentToken();
    if (!this.assertNotEndOfInput('value')) return null;
    var type = token.type;
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
    return this.parseNested('array', '[', ']', 'arrayMembers');
  },

  arrayMembers: function arrayMembers() {
    return this.parseList('arrayMembers', 'value', ',');
  },

  parseNested: function parseNested(nodeType, open, close, nestedHandler) {
    var token, node;
    node = {type: nodeType, open: null, close: null, children: null};
    node.open = this.parseTerminal(open);
    if (!this.assertNotEndOfInput(close, '|', nestedHandler)) return null;
    token = this.currentToken();
    if (token.type !== close) {
      node.children = this[nestedHandler]();
    }
    if (!this.assertNotEndOfInput(close)) return null;
    node.close = this.parseTerminal(close);
    return node;
  },

  parseList: function parseList(nodeType, memberHandler, separator) {
    var members = [], token, notDone = true, node = {type: nodeType, value: members};
    do {
      members.push(this[memberHandler]());
      if (!this.assertNotEndOfInput(separator, memberHandler)) return node;
      token = this.currentToken();
      notDone = token.type === separator;
      if (notDone) this.parseTerminal(separator);
    } while(notDone);
    return node;
  },

  parseTerminal: function parseTerminal(type) {
    if (!this.assertNotEndOfInput(type)) return null;
    if (!this.assertTypeEquals(type)) return null;
    var token = this.currentToken();
    this.getNextPair();
    return {type: token.type, value: token.value, originalValue: token.originalValue};
  },

  assertCurrentToken: function assertCurrentToken(tokenTest, ErrorCtor) {
    var token = this.currentToken();
    var expectation = expectToken(tokenTest, ErrorCtor);
    var expectationArgs = _.rest(arguments, 2);
    var tokenAssertion = expectation.apply(null, expectationArgs);
    var assertionResult = tokenAssertion(token);
    return (assertionResult instanceof Error) ? this.error(assertionResult) : true;
  },

  assertEndOfInput: function assertEndOfInput() {
    return this.assertCurrentToken(tokenDoesNotExist, errors.EndOfInputError);
  },

  assertNotEndOfInput: function assertNotEndOfInput() {
    var expectedValues = _.rest(arguments, 0);
    return this.assertCurrentToken(tokenExists, errors.UnexpectedEndOfInputError, expectedValues);
  },

  assertTypeEquals: function assertTypeEquals(type) {
    return this.assertCurrentToken(tokenTypeMatches, errors.TypeMismatchError, type);
  }

});

function tokenDoesNotExist(token) {
  return !token;
}

function tokenExists(token) {
  return !!token;
}

function tokenTypeMatches(token, type) {
  return token.type === type;
}

function expectToken(tokenTest, ErrorCtor) {
  return function expectation() {
    var expectationArgs = _.rest(arguments, 0);
    return function applyTokenTest(token) {
      var tokenTestArgs = _.rest(arguments, 0);
      return tokenTest.apply(null, tokenTestArgs.concat(expectationArgs)) || applyNew(ErrorCtor, expectationArgs.concat(tokenTestArgs));
    };
  };
}

// like calling the new operator to construct an object but allows a variable number of arguments
function applyNew(Ctor, args) {
  var err = Object.create(Ctor.prototype);
  Ctor.apply(err, args);
  return err;
}
