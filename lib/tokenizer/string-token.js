'use strict';
var
  util = require('util'),
  Token = require('./token');

util.inherits(StringToken, Token);

module.exports = StringToken;

function StringToken(options) {
  var opts = options || {};
  Token.call(this, opts);
  this.value = this.match[2];
}
