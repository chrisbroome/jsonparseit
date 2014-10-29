'use strict';

module.exports = {
  ':': /^(:)/,
  ',': /^(,)/,
  '{': /^(\{)/,
  '}': /^(\})/,
  '[': /^(\[)/,
  ']': /^(\])/,
  nl: /^(\n)/,
  true: /^(true)/,
  false: /^(false)/,
  null: /^(null)/,
  ws: /^(\s+)/,
  number: /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?)/,
  emptyString: /^("")/,
  string: /^("(((?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))|[^"\\])+)")/
};