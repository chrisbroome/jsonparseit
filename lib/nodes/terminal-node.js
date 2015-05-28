'use strict';

var
  util = require('util'),
  ValueNode = require('./value-node');

util.inherits(TerminalNode, ValueNode);

/**
 * @type {TerminalNode}
 */
module.exports = TerminalNode;

/**
 * @param {object} options
 * @constructor
 */
function TerminalNode(options) {
  var opts = options || {};
  ValueNode.call(this, opts);
//  this.originalValue = opts.originalValue;
}
