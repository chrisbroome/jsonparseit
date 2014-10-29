'use strict';
var
  util = require('util'),
  fs = require('fs'),
  _ = require('lodash'),
  Tokenizer = require('./lib/tokenizer'),
  Parser = require('./lib/parser'),
  filename = process.argv[2],
  inputStream = filename ? fs.createReadStream(filename) : process.stdin,
  tokenizer = new Tokenizer,
  parser = new Parser({tokenizer: tokenizer}),
  followSets = {},
  currentFollow = null;

tokenizer.on('error', function(err) {
  console.error('tokenizer:error:', err);
  process.exit(1);
});

tokenizer.on('data', function(token) {
  if (token.type !== 'ws')
    console.log(token.toString());
  if (!currentFollow) {
    currentFollow = token;
  } else {
    followSets[currentFollow.type] = _.union(followSets[currentFollow.type] || [], [token.type]);
    currentFollow = null;
  }

});

tokenizer.on('end', function() {
  console.log(tokenizer.toString());
  console.dir(followSets);
  console.log(util.inspect(parser.treeRoot, {colors: true, depth: null}));
  parser.getErrors().forEach(function(error) {
    console.log(error.message);
  });
});


inputStream.on('error', function(err) {
  console.error('inputStream:error:', err);
});

inputStream.pipe(tokenizer);
