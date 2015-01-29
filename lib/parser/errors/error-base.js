var
  util = require('util');

util.inherits(ErrorBase, Error);

/**
 * @type {ErrorBase}
 */
module.exports = ErrorBase;

/**
 * Abstract base error
 * @param {String} [message]
 * @constructor
 * @abstract
 */
function ErrorBase(message) {
  var ctor = this.constructor;
  Error.captureStackTrace(this, ctor);
  this.message = message;
  this.name = ctor.name;
  this.statusCode = 500;
}
