'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(FalseToken, Token);

/**
 * @type {FalseToken}
 */
module.exports = FalseToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function FalseToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = false;
}
