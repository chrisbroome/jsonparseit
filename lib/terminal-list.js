var
  TerminalList = require('lexit').TerminalList,
  tokenFactory = require('./token-factory');

module.exports = new TerminalList([
  [':', /^(:)/],
  [',', /^(,)/],
  ['{', /^(\{)/],
  ['}', /^(})/],
  ['[', /^(\[)/],
  [']', /^(])/],
  ['nl', /^(\n)/],
  ['true', /^(true)/],
  ['false', /^(false)/],
  ['null', /^(null)/],
  // whitespace specifically does not include newlines so that we can keep accurate line counts
  ['ws', /^([ \f\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+)/],
  ['number', /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?)/],
  ['string', /^("")/],
  ['string', /^("(((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+)")/]
], tokenFactory);
