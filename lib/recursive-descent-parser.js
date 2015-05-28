'use strict';
var
  _ = require('lodash'),
  util = require('util'),
  stream = require('stream'),
  InvalidValueError = require('./errors/invalid-value-error'),
  EndOfInputError = require('./errors/end-of-input-error'),
  TypeMismatchError = require('./errors/type-mismatch-error'),
  UnexpectedEndOfInputError = require('./errors/unexpected-end-of-input-error'),
  ArrayNode = require('./nodes/array-node'),
  FalseNode = require('./nodes/false-node'),
  NullNode = require('./nodes/null-node'),
  NumberNode = require('./nodes/number-node'),
  ObjectNode = require('./nodes/object-node'),
  PairNode = require('./nodes/pair-node'),
  StringNode = require('./nodes/string-node'),
  TrueNode = require('./nodes/true-node');

util.inherits(RecursiveDescentParser, stream.Transform);

/**
 * @param {Object} options
 * @constructor
 */
function RecursiveDescentParser(options) {
  var
    opts = options || {};

  this._errors = [];
  this._tokens = [];
  this._tokenPointer = 0;
  this._ignoreTokens = ['ws', 'nl'];
  this.treeRoot = null;

  opts.writableObjectMode = true;
  opts.readableObjectMode = true;
  stream.Transform.call(this, opts)
}
_.extend(RecursiveDescentParser.prototype, {

  _transform: function(token, encoding, cb) {
    if (!this.ignoreTokens(token.type)) this._tokens.push(token);
    cb();
  },

  _flush: function(cb) {
    this.treeRoot = this.value();
    this.assertEndOfInput();
    if (this.hasErrors()) this.emit('error', this.getErrors());
    this.push(this.treeRoot);
    cb();
  },

  /**
   * Adds an error to the internal error stack
   * @param {Error} err
   * @returns {boolean}
   */
  error: function error(err) {
    this._errors.push(err);
    return false;
  },

  /**
   * Advances the iterator
   */
  next: function next() {
    this._tokenPointer += 1;
  },

  /**
   * Get the internal error stack
   * @returns {Array}
   */
  getErrors: function getErrors() {
    return this._errors;
  },

  /**
   * Whether or not we have errors
   * @return {boolean}
   */
  hasErrors: function() {
    return this._errors.length > 0;
  },

  /**
   * Tests whether or not we should ignore this type of token
   * @param {string} tokenType
   * @returns {boolean}
   */
  ignoreTokens: function ignoreTokens(tokenType) {
    return this._ignoreTokens.indexOf(tokenType) >= 0;
  },

  /**
   * Get the current token in the token stack
   * @returns {Token}
   */
  currentToken: function currentToken() {
    return this._tokens[this._tokenPointer];
  },

  /**
   * Parses an object token
   * @returns {Object|null}
   */
  object: function object() {
    return this.parseContainer(ObjectNode, 'pair');
  },

  /**
   * Parses a key/value pair
   * @returns {KeyValuePairNode}
   */
  pair: function pair() {
    var key = this.parseString(), value;
    this.nextTerminalToken(':');
    value = this.value();
    return new PairNode({key: key, value: value});
  },

  /**
   * Parses a value
   * @returns {*}
   */
  value: function value() {
    var token = this.currentToken();
    if (!this.assertNotEndOfInput('value')) return null;
    switch (token.type) {
      case 'false': return this.parseFalse();
      case 'null': return this.parseNull();
      case 'number': return this.parseNumber();
      case 'string': return this.parseString();
      case 'true': return this.parseTrue();
      case '{': return this.object();
      case '[': return this.array();
      default:
        this.error(new InvalidValueError(token));
        return null;
    }
  },

  /**
   * Parses an array
   * @returns {Object|null}
   */
  array: function array() {
    return this.parseContainer(ArrayNode, 'value');
  },

  /**
   * Parses the 'false' expression
   * @returns {Object|null}
   */
  parseFalse: function parseFalse() {
    return this.parseTerminal(FalseNode);
  },

  /**
   * Parses a number
   * @returns {Object|null}
   */
  parseNumber: function parseNumber() {
    return this.parseTerminal(NumberNode);
  },

  /**
   * Parses null
   * @returns {Object|null}
   */
  parseNull: function parseNull() {
    return this.parseTerminal(NullNode);
  },

  /**
   * Parses a string
   * @returns {Object|null}
   */
  parseString: function parseString() {
    return this.parseTerminal(StringNode);
  },

  /**
   * Parses the 'true' literal expression
   * @returns {Object|null}
   */
  parseTrue: function parseTrue(){
    return this.parseTerminal(TrueNode);
  },

  /**
   * Parses an opening token, closing token, and anything nested inside
   * @param {ContainerNode} ContainerNodeCtor - The subclass constructor of type {@link ContainerNode} to use when creating this node
   * @param {String} nestedMemberHandler - The name of the method that handles parsing the nested elements
   * @returns {Object|null}
   */
  parseContainer: function parseContainer(ContainerNodeCtor, nestedMemberHandler) {
    var token, node = new ContainerNodeCtor, open = node.open, close = node.close;
    this.nextTerminalToken(open);
    if (!this.assertNotEndOfInput(close, '|', nestedMemberHandler)) return null;
    token = this.currentToken();
    if (token.type !== close) this.parseContainerMembers(node, nestedMemberHandler);
    if (!this.assertNotEndOfInput(close)) return null;
    this.nextTerminalToken(close);
    return node;
  },

  /**
   * Parses a list of values
   * @param {TerminalNode} containerNode - The subclass constructor of type {@link ListNode} to use when creating this node
   * @param {String} memberHandler - The name of the method that handles parsing one element of the list
   * @returns {Object}
   */
  parseContainerMembers: function parseContainerMembers(containerNode, memberHandler) {
    var token, notDone = true, node = containerNode, separator = node.sep;
    do {
      node.items.push(this[memberHandler]());
      if (!this.assertNotEndOfInput(separator, memberHandler)) return node;
      token = this.currentToken();
      notDone = token.type === separator;
      if (notDone) this.nextTerminalToken(separator);
    } while(notDone);
    return node;
  },

  /**
   * Parses a terminal of the specified type AND advances the iterator to the next token in the stream
   * @param {TerminalNode} NodeCtor - The constructor to use to create the node
   * @returns {Object|null}
   */
  parseTerminal: function parseTerminal(NodeCtor) {
    var type = NodeCtor.type;
    var token = this.nextTerminalToken(type);
    if (!token) return null;
    return new NodeCtor(token);
  },

  /**
   * Gets the next terminal token AND advances the iterator to the next token in the stream
   * @param {String} type - The type of terminal that we are expecting next
   * @returns {Object|null}
   */
  nextTerminalToken: function nextTerminalToken(type) {
    if (!this.assertNotEndOfInput(type)) return null;
    if (!this.assertTypeEquals(type)) return null;
    var token = this.currentToken();
    this.next();
    return token;
  },

  assertCurrentToken: function assertCurrentToken(tokenTest, ErrorCtor) {
    var token = this.currentToken();
    var expectation = expectToken(tokenTest, ErrorCtor);
    var expectationArgs = _.drop(arguments, 2);
    var tokenAssertion = expectation.apply(null, expectationArgs);
    var assertionResult = tokenAssertion(token);
    return (assertionResult instanceof Error) ? this.error(assertionResult) : true;
  },

  assertEndOfInput: function assertEndOfInput() {
    return this.assertCurrentToken(tokenDoesNotExist, EndOfInputError);
  },

  assertNotEndOfInput: function assertNotEndOfInput() {
    var expectedValues = _.drop(arguments, 0);
    return this.assertCurrentToken(tokenExists, UnexpectedEndOfInputError, expectedValues);
  },

  assertTypeEquals: function assertTypeEquals(type) {
    return this.assertCurrentToken(tokenTypeMatches, TypeMismatchError, type);
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
    var expectationArgs = _.drop(arguments, 0);
    return function applyTokenTest(token) {
      var tokenTestArgs = _.drop(arguments, 0);
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

/**
 * @type {RecursiveDescentParser}
 */
module.exports = RecursiveDescentParser;
