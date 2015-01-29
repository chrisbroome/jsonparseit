'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(StringToken, Token);

/**
 * @type {StringToken}
 */
module.exports = StringToken;

/**
 * @param {object} options
 * @constructor
 */
function StringToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = this.match[2];
}
