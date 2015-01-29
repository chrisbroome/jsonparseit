'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(TrueNode, TerminalNode);

/**
 * @type {TrueNode}
 */
module.exports = TrueNode;

/**
 * @param {object} options
 * @constructor
 */
function TrueNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'true';
  this.value = true;
}
TrueNode.type = 'true';
