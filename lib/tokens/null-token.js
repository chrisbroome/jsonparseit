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
 * @param {object} options
 * @constructor
 */
function NullToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = null;
}
