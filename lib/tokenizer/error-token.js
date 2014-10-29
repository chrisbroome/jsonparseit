'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(ErrorToken, Token);

module.exports = ErrorToken;

function ErrorToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.length = this.value.length;
  this.value = void 0;
}
