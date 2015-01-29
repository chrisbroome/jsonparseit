'use strict';

var
  util = require('util'),
  NodeBase = require('./node-base');

util.inherits(ValueNode, NodeBase);

/**
 * @type {ValueNode}
 */
module.exports = ValueNode;

/**
 * @param {object} options
 * @constructor
 */
function ValueNode(options) {
  var opts = options || {};
  NodeBase.call(this, opts);
  this.value = opts.value;
}
