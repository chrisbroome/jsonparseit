'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(FalseNode, TerminalNode);

module.exports = FalseNode;

FalseNode.type = 'false';
function FalseNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'false';
  this.value = false;
}
