var
  util = require('util');

util.inherits(UnexpectedEndOfInputError, Error);

module.exports = UnexpectedEndOfInputError;

function UnexpectedEndOfInputError(expectedValues) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Unexpected end of input reached. Expected ' + expectedValues.join(' ');
}
