var
  util = require('util'),
  ErrorBase = require('./error-base');

util.inherits(InvalidValueError, ErrorBase);

/**
 * @constructor
 * @param {Token} token
 */
function InvalidValueError(token) {
  ErrorBase.call(this, 'Invalid value');
  this.token = token;
  this.fileInfo = token.fileInfo;
}

/** @type {InvalidValueError} */
module.exports = InvalidValueError;
