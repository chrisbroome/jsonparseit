'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(TrueNode, TerminalNode);

module.exports = TrueNode;

TrueNode.type = 'true';
function TrueNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'true';
  this.value = true;
}
