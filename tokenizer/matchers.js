'use strict';
module.exports = {
  colon: /^(:)/,
  comma: /^(,)/,
  objectStart: /^(\{)/,
  objectEnd: /^(\})/,
  arrayStart: /^(\[)/,
  arrayEnd: /^(\])/,
  true: /^(true)/,
  false: /^(false)/,
  null: /^(null)/,
  ws: /^([\s\n]+)/,
  number: /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?)/,
  emptyString: /^("")/,
  doubleQuote: /^(")/,
  chars: /^(((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+)/
};
//  nonEmptyString:      /^("((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+")/,
//  nonTerminatedString: /^("((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+)/,
//  nonInitiatedString:   /^(((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+")/
