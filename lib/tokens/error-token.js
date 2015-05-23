'use strict';
var
  util = require('util'),
  Token = require('../tokenizer/token');

util.inherits(ErrorToken, Token);

/**
 * @type {ErrorToken}
 */
module.exports = ErrorToken;

/**
 * @param {object} options
 * @constructor
 */
function ErrorToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.length = this.value.length;
  this.value = void 0;
}
