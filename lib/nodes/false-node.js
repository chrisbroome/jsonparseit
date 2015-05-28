'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(FalseNode, TerminalNode);

/**
 * @type {FalseNode}
 */
module.exports = FalseNode;

/**
 * @param {object} options
 * @constructor
 */
function FalseNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'false';
  this.value = false;
}
FalseNode.type = 'false';
