'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(NullToken, Token);

/**
 * @type {NullToken}
 */
module.exports = NullToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function NullToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = null;
}
