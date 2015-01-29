'use strict';

var
  util = require('util'),
  ValueNode = require('./value-node');

util.inherits(KeyValuePairNode, ValueNode);

/**
 * @type {KeyValuePairNode}
 */
module.exports = KeyValuePairNode;

/**
 * @param {object} options
 * @constructor
 */
function KeyValuePairNode(options) {
  var opts = options || {};
  ValueNode.call(this, opts);
  this.type = 'pair';
  this.sep = ':';
  this.key = opts.key;
}
