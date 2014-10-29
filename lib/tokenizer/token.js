'use strict';
var _ = require('lodash');

module.exports = Token;

function Token(options) {
  var opts = options || {};
  this.column = opts.column;
  this.length = opts.length || 0;
  this.line = opts.line;
  this.match = opts.match;
  this.position = opts.position || 0;
  this.type = opts.type;
  this.value = opts.value;
  this.originalValue = opts.value;
}
Token.prototype = {

  inspect: function inspect() {
    return _.omit(this, 'match');
  },

  toString: function toString() {
    return this.toBaseString() + " '" + this.value + "'";
  },

  toErrorString: function toErrorString() {
    return this.toBaseString() + " '" + this.value.substring(0, 80) + "'";
  },

  toBaseString: function toBaseString() {
    return '(' + this.line + ':' + this.column + (this.length > 1 ? '-' + (this.column + this.length) : '') + ') ' + this.type + ' ';
  }
};
