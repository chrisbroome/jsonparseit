'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(EmptyStringToken, Token);

/**
 * @type {EmptyStringToken}
 */
module.exports = EmptyStringToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function EmptyStringToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = '';
}
