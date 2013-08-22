var fs = require('fs');
var Tokenizer = require('./tokenizer');
var ErrorAggregator = require('./tokenizer/error-aggregator');

var stream = require('stream');

var filename = process.argv[2];
var inputStream = filename ? fs.createReadStream(filename) : process.stdin;

var tokenizer = new Tokenizer;
tokenizer.on('token', function(token) {
  var t  = token.type;
  if( t !== 'error' && t !== 'ws' ) {
    console.log('token: ', token);
  }
});
tokenizer.on('token', function(token) {
  if( token.type == 'error') {
    console.error('error: ', token);
  }
});

var errors = new ErrorAggregator;
// errors.on('errorAggregate', function(error){
  // console.error('error: ', error);
// });

var pipeline = [
  tokenizer,
  errors,
];

pipeline.reduce(function(a, next) {
  return a.pipe(next);
}, inputStream);
