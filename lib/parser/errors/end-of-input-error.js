var
  util = require('util'),
  ErrorBase = require('./error-base');

util.inherits(EndOfInputError, ErrorBase);

/**
 * @type {EndOfInputError}
 */
module.exports = EndOfInputError;

/**
 * @param {Token} token
 * @constructor
 */
function EndOfInputError(token) {
  ErrorBase.call(this, 'Expected end of input at ' + token.toLineString() + '. Found ' + token.type + ' instead');
  this.token = token;
}
