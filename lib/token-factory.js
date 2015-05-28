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
  //'emptyString': EmptyStringToken,
  'string': StringToken,
  'number': NumberToken,
  'null': NullToken,
  'true': TrueToken,
  'false': FalseToken
};

/**
 * @param {TerminalMatch} terminalMatch
 * @param {FileInfo} fileInfo
 * @return {Token}
 */
module.exports = function(terminalMatch, fileInfo) {
  var
    type = terminalMatch.type,
    TokenCtor = tokenTable.hasOwnProperty(type) ? tokenTable[type] : Token;

  return new TokenCtor(terminalMatch, fileInfo);
};
