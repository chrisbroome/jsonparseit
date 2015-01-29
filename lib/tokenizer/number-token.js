'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(NumberToken, Token);

/**
 * @type {NumberToken}
 */
module.exports = NumberToken;

/**
 * @param {object} options
 * @constructor
 */
function NumberToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.originalValue = this.value;
  this.value = +this.value;
}
