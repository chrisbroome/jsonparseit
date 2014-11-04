'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(NullNode, TerminalNode);

module.exports = NullNode;

NullNode.type = 'null';
function NullNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'null';
  this.value = null;
}
