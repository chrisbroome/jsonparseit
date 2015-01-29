'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(NullNode, TerminalNode);

/**
 * @type {NullNode}
 */
module.exports = NullNode;

/**
 * @param {object} options
 * @constructor
 */
function NullNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'null';
  this.value = null;
}
NullNode.type = 'null';
