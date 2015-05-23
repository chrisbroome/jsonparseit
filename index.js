var
  util = require('util'),
  fs = require('fs'),
  lexit = require('lexit'),
  Parser = require('./lib/recursive-descent-parser');

(function main(){

  var
    matchers = require('./lib/tokens/matchers'),
    tokenFactory = require('./lib/token-factory'),
    tokenizer = getTokenizer(matchers, tokenFactory),
    parser = new Parser({tokenizer: tokenizer}),
    inputStream = getInputStream();

  tokenizer.on('end', function() {
    var errors = parser.getErrors();
    console.log(tokenizer.toString());
    console.log(util.inspect(parser.treeRoot, {colors: true, depth: null}));
    console.log('Parsed ' + parser._tokenPointer + ' tokens. ' + errors.length + ' errors.');
    errors.forEach(function(error) {
      console.error('Error:', error.message);
    });
  });

  inputStream.pipe(tokenizer);

}());

function getInputStream() {
  var
    filename = process.argv[2],
    inputStream = filename ? fs.createReadStream(filename) : process.stdin;

  inputStream.on('error', function(err) {
    console.error('inputStream:error:', err);
  });

  return inputStream;
}


function getTokenizer(matchers, tokenFactory) {
  var tokenizer = new lexit.Tokenizer(matchers, tokenFactory);

  tokenizer.on('error', function(err) {
    console.error('tokenizer:error:', err);
    process.exit(1);
  });

  tokenizer.on('data', function(token) {
    if (token.type !== 'ws') console.log(token.toString());
  });


  return tokenizer;
}
