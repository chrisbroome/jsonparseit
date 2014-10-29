'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(EmptyStringToken, Token);

module.exports = EmptyStringToken;

function EmptyStringToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = '';
}
