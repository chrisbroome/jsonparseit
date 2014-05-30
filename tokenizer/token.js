
module.exports = Token;

function Token(options) {
  var opts = options || {};
  this.value = opts.value;
  this.type = opts.type;
  this.length = opts.length || 0;
  this.position = opts.position || 0;
}

Token.create = function(options) {
  if (options instanceof Token) return options;
  return new Token(options);
};

Token.prototype = {
  toString: function() {
    return this.position + ' ' + this.length + ' ' + this.type + ' ' + this.value;
  }
};
