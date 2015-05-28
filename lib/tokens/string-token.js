'use strict';
var
  util = require('util'),
  Token = require('lexit').Token;

util.inherits(StringToken, Token);

/**
 * @type {StringToken}
 */
module.exports = StringToken;

/**
 * @constructor
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 */
function StringToken(terminalMatch, fileInfo) {
  Token.call(this, terminalMatch, fileInfo);
  this.value = this.match[2];
}
