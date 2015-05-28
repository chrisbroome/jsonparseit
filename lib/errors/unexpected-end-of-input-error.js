var
  util = require('util'),
  ErrorBase = require('./error-base');

util.inherits(UnexpectedEndOfInputError, ErrorBase);

/**
 * @type {UnexpectedEndOfInputError}
 */
module.exports = UnexpectedEndOfInputError;

/**
 * @param {*} expectedValues
 * @constructor
 */
function UnexpectedEndOfInputError(expectedValues) {
  ErrorBase.call(this, 'Unexpected end of input reached. Expected ' + expectedValues.join(' '));
}
