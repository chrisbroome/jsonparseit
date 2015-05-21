'use strict';
var
  util = require('util'),
  fs = require('fs'),
  Tokenizer = require('./lib/tokenizer'),
  Parser = require('./lib/recursive-descent-parser'),
  filename = process.argv[2],
  inputStream = filename ? fs.createReadStream(filename) : process.stdin,
  tokenizer = new Tokenizer,
  parser = new Parser({tokenizer: tokenizer});

tokenizer.on('error', function(err) {
  console.error('tokenizer:error:', err);
  process.exit(1);
});

tokenizer.on('data', function(token) {
  if (token.type !== 'ws') console.log(token.toString());
});

tokenizer.on('end', function() {
  var errors = parser.getErrors();
  console.log(tokenizer.toString());
  console.log(util.inspect(parser.treeRoot, {colors: true, depth: null}));
  console.log('Parsed ' + parser._tokenPointer + ' tokens. ' + errors.length + ' errors.');
  errors.forEach(function(error) {
    console.error('Error:', error.message);
  });
});

inputStream.on('error', function(err) {
  console.error('inputStream:error:', err);
});

inputStream.pipe(tokenizer);
