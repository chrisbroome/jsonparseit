'use strict';

var
  util = require('util'),
  TerminalNode = require('./terminal-node');

util.inherits(StringNode, TerminalNode);

module.exports = StringNode;

StringNode.type = 'string';
function StringNode(options) {
  var opts = options || {};
  TerminalNode.call(this, opts);
  this.type = 'string';
}
