'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(FalseToken, Token);

/**
 * @type {FalseToken}
 */
module.exports = FalseToken;

/**
 * @param {object} options
 * @constructor
 */
function FalseToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = false;
}
