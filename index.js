'use strict';
var
  fs = require('fs'),
  Tokenizer = require('./lib/tokenizer'),
  filename = process.argv[2],
  inputStream = filename ? fs.createReadStream(filename) : process.stdin,
  tokenizer = new Tokenizer;

tokenizer.on('error', function(err, next) {
  console.error('tokenizer:error:', err);
  next();
});

tokenizer.on('data', function(token) {
  if (token.type !== 'ws')
    console.log(token.toString());
});

inputStream.on('error', function(err, next) {
  console.error('inputStream:error:', err);
  next();
});

inputStream.pipe(tokenizer);
