'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(NumberNode, TerminalNode);

/**
 * @type {NumberNode}
 */
module.exports = NumberNode;

/**
 * @param {object} options
 * @constructor
 */
function NumberNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'number';
}
NumberNode.type = 'number';
