'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(ErrorToken, Token);

/**
 * @type {ErrorToken}
 */
module.exports = ErrorToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function ErrorToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = void 0;
}
