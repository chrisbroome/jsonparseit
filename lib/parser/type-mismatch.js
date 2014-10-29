var
  util = require('util');

util.inherits(TypeMismatchError, Error);

module.exports = TypeMismatchError;

function TypeMismatchError(expectedType, token) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = token.toString() + ': expected ' + expectedType + ' actual type seen was ' + token.type;
  this.token = token;
  this.expectedType = expectedType;
}
