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
 * @param options
 * @constructor
 */
function EmptyStringToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = '';
}
