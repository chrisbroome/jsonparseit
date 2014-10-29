'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(NullToken, Token);

module.exports = NullToken;

function NullToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = null;
}
