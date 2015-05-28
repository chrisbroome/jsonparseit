'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(TrueToken, Token);

/**
 * @type {TrueToken}
 */
module.exports = TrueToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function TrueToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = true;
}
