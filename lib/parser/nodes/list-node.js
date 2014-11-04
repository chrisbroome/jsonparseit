'use strict';

var
  util = require('util'),
  NodeBase = require('./node-base');

util.inherits(ListNode, NodeBase);

module.exports = ListNode;

/**
 * @class
 * @type {Object}
 * @param {Object} options
 * @constructor
 */
function ListNode(options) {
  var opts = options || {};
  NodeBase.call(this, opts);
  this.sep = opts.sep || void 0;
  if (!this.value) this.value = [];
}
