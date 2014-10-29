'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(TrueToken, Token);

module.exports = TrueToken;

function TrueToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = true;
}
