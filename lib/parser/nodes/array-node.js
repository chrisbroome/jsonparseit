'use strict';

var
  util = require('util'),
  ContainerNode = require('./container-node');

util.inherits(ArrayNode, ContainerNode);

module.exports = ArrayNode;

/**
 * @class
 * @type {Object}
 * @param {Object} options
 * @constructor
 */
function ArrayNode(options) {
  var opts = options || {};
  ContainerNode.call(this, opts);
  this.type = 'array';
  this.open = '[';
  this.close = ']';
  this.sep = ',';
}
