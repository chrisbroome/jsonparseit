'use strict';

var
  util = require('util'),
  NodeBase = require('./node-base');

util.inherits(ValueNode, NodeBase);

module.exports = ValueNode;

/**
 * @class
 * @param options
 * @constructor
 */
function ValueNode(options) {
  var opts = options || {};
  NodeBase.call(this, opts);
  this.value = opts.value;
}
