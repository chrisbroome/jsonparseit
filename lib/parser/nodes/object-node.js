'use strict';

var
  util = require('util'),
  ContainerNode = require('./container-node');

util.inherits(ObjectNode, ContainerNode);

module.exports = ObjectNode;

/**
 * @class
 * @type {Object}
 * @param {Object} options
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
