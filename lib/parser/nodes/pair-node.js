'use strict';

var
  util = require('util'),
  ValueNode = require('./value-node');

util.inherits(KeyValuePairNode, ValueNode);

module.exports = KeyValuePairNode;

/**
 * @class
 * @type {Object}
 * @param {Object} options
 * @constructor
 */
function KeyValuePairNode(options) {
  var opts = options || {};
  ValueNode.call(this, opts);
  this.type = 'pair';
  this.sep = ':';
  this.key = opts.key;
}
