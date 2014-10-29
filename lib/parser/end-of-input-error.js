var
  util = require('util');

util.inherits(EndOfInputError, Error);

module.exports = EndOfInputError;

function EndOfInputError(token) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Expected end of input at ' + token.toLineString() + '. Found ' + token.type + ' instead';
  this.token = token;
}
