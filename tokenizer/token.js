var util = require('util');

function Token(options) {
  var opts = options || {};
  this.value = opts.value;
  this.type = opts.type;
  this.length = opts.length;
  this.position = opts.position;
}

Token.create = function(options) {
  return new Token(options);
};

Token.prototype = {
  type: void 0,
  value: void 0,
  position: 0,
  length: 0,
  toString: function() {
    return this.value;
  }
};

module.exports = Token;
