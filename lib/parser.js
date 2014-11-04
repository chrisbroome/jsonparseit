'use strict';
var
  _ = require('lodash'),
  errors = require('./parser/errors'),
  ArrayNode = require('./parser/nodes/array-node'),
  FalseNode = require('./parser/nodes/false-node'),
  NullNode = require('./parser/nodes/null-node'),
  NumberNode = require('./parser/nodes/number-node'),
  ObjectNode = require('./parser/nodes/object-node'),
  PairNode = require('./parser/nodes/pair-node'),
  StringNode = require('./parser/nodes/string-node'),
  TrueNode = require('./parser/nodes/true-node');

module.exports = Parser;

function Parser(options) {
  var
    self = this,
    opts = options || {},
    tokenizer = opts.tokenizer;
  this.tokenizer = tokenizer;
  this._errors = [];
  this._tokens = [];
  this._tokenPointer = 0;
  this._ignoreTokens = ['ws', 'nl'];
  this.treeRoot = null;
  tokenizer.on('data', function parseToken(token) {
    if (!self.ignoreTokens(token.type)) self._tokens.push(token);
  });
  tokenizer.on('end', function parseTokens() {
    self.treeRoot = self.value();
    self.assertEndOfInput();
  });
}
_.extend(Parser.prototype, {

  error: function error(err) {
    this._errors.push(err);
    return false;
  },

  // advances the iterator
  next: function next() {
    this._tokenPointer += 1;
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

  object: function object() {
    return this.parseContainer(ObjectNode, 'pair');
  },

  pair: function pair() {
    var key = this.parseString(), value;
    this.nextTerminalToken(':');
    value = this.value();
    return new PairNode({key: key, value: value});
  },

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
        this.error(new Error('invalid value'));
        return null;
    }
  },

  array: function array() {
    return this.parseContainer(ArrayNode, 'value');
  },

  parseFalse: function parseFalse() {
    return this.parseTerminal(FalseNode);
  },

  parseNumber: function parseNumber() {
    return this.parseTerminal(NumberNode);
  },

  parseNull: function parseNull() {
    return this.parseTerminal(NullNode);
  },

  parseString: function parseString() {
    return this.parseTerminal(StringNode);
  },

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
