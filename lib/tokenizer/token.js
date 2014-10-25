
module.exports = Token;

function Token(options) {
  var opts = options || {};
  this.column = opts.column;
  this.length = opts.length || 0;
  this.line = opts.line;
  this.position = opts.position || 0;
  this.type = opts.type;
  this.value = opts.value;
}
Token.prototype = {
  toString: function toString() {
    return '(' + this.line + ':' + this.column + ')[' + this.type + "] '" + this.value + "'";
  }
};
