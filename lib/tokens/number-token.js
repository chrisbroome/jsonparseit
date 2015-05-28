'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(NumberToken, Token);

/**
 * @type {NumberToken}
 */
module.exports = NumberToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function NumberToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = +this.originalValue;
}
