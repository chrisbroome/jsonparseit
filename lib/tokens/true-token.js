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
 * @param {object} options
 * @constructor
 */
function TrueToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = true;
}
