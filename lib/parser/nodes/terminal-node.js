'use strict';

var
  util = require('util'),
  ValueNode = require('./value-node');

util.inherits(TerminalNode, ValueNode);

module.exports = TerminalNode;

function TerminalNode(options) {
  var opts = options || {};
  ValueNode.call(this, opts);
//  this.originalValue = opts.originalValue;
}
