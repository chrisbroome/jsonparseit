'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(StringNode, TerminalNode);

/**
 * @type {StringNode}
 */
module.exports = StringNode;

/**
 * @param {object} options
 * @constructor
 */
function StringNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'string';
}
StringNode.type = 'string';
