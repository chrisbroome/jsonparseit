var
  util = require('util');

util.inherits(ErrorBase, Error);

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
}

/** @type {ErrorBase} */
module.exports = ErrorBase;
