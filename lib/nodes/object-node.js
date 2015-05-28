'use strict';

var
  util = require('util'),
  ContainerNode = require('./container-node');

util.inherits(ObjectNode, ContainerNode);

/**
 * @type {ObjectNode}
 */
module.exports = ObjectNode;

/**
 * @param {object} options
 * @constructor
 */
function ObjectNode(options) {
  var opts = options || {};
  ContainerNode.call(this, opts);
  this.type = 'object';
  this.open = '{';
  this.close = '}';
  this.sep = ',';
}
