var
  Token = require('./tokenizer/token'),
  EmptyStringToken = require('./tokenizer/empty-string-token'),
  ErrorToken = require('./tokenizer/error-token'),
  FalseToken = require('./tokenizer/false-token'),
  NullToken = require('./tokenizer/null-token'),
  NumberToken = require('./tokenizer/number-token'),
  StringToken = require('./tokenizer/string-token'),
  TrueToken = require('./tokenizer/true-token');

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
