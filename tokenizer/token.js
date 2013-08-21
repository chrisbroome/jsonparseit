var util = require('util');

function Token(options) {
  var opts = options || {};
  this.value = opts.value;
  this.type = opts.type;
  this.length = opts.length;
}

Token.create = function(options) {
  return new Token(options);
};

Token.prototype = {
  type: void 0,
  value: void 0,
  length: 0,
  toString: function() {
    return this.type + ' ' + this.length + ': ' + this.value + '\n';
  }
};

module.exports = Token;
