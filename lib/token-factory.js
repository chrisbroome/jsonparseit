var
  Token = require('lexit').Token,
  EmptyStringToken = require('./tokens/empty-string-token'),
  ErrorToken = require('./tokens/error-token'),
  FalseToken = require('./tokens/false-token'),
  NullToken = require('./tokens/null-token'),
  NumberToken = require('./tokens/number-token'),
  StringToken = require('./tokens/string-token'),
  TrueToken = require('./tokens/true-token');

var tokenTable = {
  'error': ErrorToken,
  'emptyString': EmptyStringToken,
  'string': StringToken,
  'number': NumberToken,
  'null': NullToken,
  'true': TrueToken,
  'false': FalseToken
};

/**
 * @param {String} type
 * @param {Object} opts
 * @return {Token}
 */
module.exports = function(type, opts) {
  if (opts.type === 'emptyString') opts.type = 'string';

  return tokenTable.hasOwnProperty(type) ?
    new tokenTable[type](opts) :
    new Token(opts);
};
