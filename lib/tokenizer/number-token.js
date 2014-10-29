'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(NumberToken, Token);

module.exports = NumberToken;

function NumberToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.originalValue = this.value;
  this.value = +this.value;
}
