var
  util = require('util'),
  ErrorBase = require('./error-base');

util.inherits(TypeMismatchError, ErrorBase);

/**
 * @type {TypeMismatchError}
 */
module.exports = TypeMismatchError;

/**
 * @param {string} expectedType
 * @param {Token} token
 * @constructor
 */
function TypeMismatchError(expectedType, token) {
  ErrorBase.call(this, token.toString() + ': expected ' + expectedType + ' actual type seen was ' + token.type);
  this.token = token;
  this.expectedType = expectedType;
}
