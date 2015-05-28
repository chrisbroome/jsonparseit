'use strict';

var
  util = require('util'),
  NodeBase = require('./node-base');

util.inherits(ListNode, NodeBase);

/**
 * @type {ListNode}
 */
module.exports = ListNode;

/**
 * @param {object} options
 * @constructor
 */
function ListNode(options) {
  var opts = options || {};
  NodeBase.call(this, opts);
  this.sep = opts.sep || void 0;
  if (!this.value) this.value = [];
}
