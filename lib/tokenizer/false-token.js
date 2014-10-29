'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(FalseToken, Token);

module.exports = FalseToken;

function FalseToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = false;
}
