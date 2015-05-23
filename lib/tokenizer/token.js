/**
 * @constructor
 * @param {object} options
 */
function Token(options) {
  var opts = options || {};
  /** @type {FileInfo} */
  this.fileInfo = opts.fileInfo;
  this.type = opts.type;
  this.value = opts.value;
  this.length = this.value.length || 0;
  this.originalValue = opts.value;
  Object.defineProperty(this, 'match', {
    value: opts.match
  });
}
Token.prototype = {

  toString: function toString() {
    return this.toBaseString() + " '" + this.value + "'";
  },

  toErrorString: function toErrorString() {
    return this.toBaseString() + " '" + this.value.substring(0, 80) + "'";
  },

  toLineString: function toLineString() {
    var
      fi = this.fileInfo,
      len = this.length;
    return '(' + fi.toString() + (len > 1 ? '-' + (fi.column + len) : '') + ')';
  },

  toBaseString: function toBaseString() {
    return this.toLineString() + ' ' + this.type + ' ';
  }
};

/** @type {Token} */
module.exports = Token;
