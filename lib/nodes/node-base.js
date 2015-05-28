'use strict';

/**
 * @type {NodeBase}
 */
module.exports = NodeBase;

/**
 * @param {object} options
 * @constructor
 */
function NodeBase(options) {
  var opts = options || {};
  this.type = opts.type;
}
