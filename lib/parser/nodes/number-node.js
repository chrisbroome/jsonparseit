'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(NumberNode, TerminalNode);

module.exports = NumberNode;

NumberNode.type = 'number';
function NumberNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'number';
}
