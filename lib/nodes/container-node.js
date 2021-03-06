'use strict';

var
  util = require('util'),
  NodeBase = require('./node-base');

util.inherits(ContainerNode, NodeBase);

/**
 * @type {ContainerNode}
 */
module.exports = ContainerNode;

/**
 * @param {object} options
 * @constructor
 */
function ContainerNode(options) {
  var opts = options || {};
  NodeBase.call(this, opts);
  this.open = opts.open || void 0;
  this.close = opts.close || void 0;
  this.sep = opts.sep || void 0;
  this.items = opts.items || [];
}
