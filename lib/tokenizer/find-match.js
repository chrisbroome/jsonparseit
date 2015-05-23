/**
 * Creates tokens based on the input slice. An error token is returned if the slice does match.
 * @param {String} slice
 * @param {Object} fileInfo
 * @param {String[]} matcherNames
 * @param {Object} matchers
 * @param {Number} matcherLength
 * @param {tokenFactoryCallback} tokenFactory
 * @return {Token}
 */
module.exports = function(slice, fileInfo, matcherNames, matchers, matcherLength, tokenFactory) {
  var i = 0, matchNotFound = true, type, match;

  while (matchNotFound && i < matcherLength) {
    type = matcherNames[i];
    match = slice.match(matchers[type]);
    i++;
    matchNotFound = match === null;
  }

  return matchNotFound ?
    createToken(tokenFactory, fileInfo, match, 'error', slice) :
    createToken(tokenFactory, fileInfo, match, type, match[1]);
};

/**
 * @param {tokenFactoryCallback} tokenFactory
 * @param type
 * @param match
 * @param value
 * @param fileInfo
 * @returns {Token}
 */
function createToken(tokenFactory, fileInfo, match, type, value) {
  return tokenFactory(type, {
    fileInfo: fileInfo,
    match: match,
    type: type,
    value: value
  });
}

/**
 * @callback tokenFactoryCallback
 * @param {String} type
 * @param {Object} opts
 */
