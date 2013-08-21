var fs = require('fs');
var Tokenizer = require('./tokenizer');
var ErrorAggregator = require('./tokenizer/error-aggregator');
var WsFilter = require('./tokenizer/ws-filter');

var stream = require('stream');

var filename = process.argv[2];

if(!filename) throw new Error('Filename is required');

var pipeline = [
  new Tokenizer({objectMode: true}),
  new ErrorAggregator({objectMode: true}),
  new WsFilter({objectMode: true}),
  new stream.PassThrough({objectMode: true, encoding: 'utf-8'}),
  process.stdout
];

var stream = fs.createReadStream(filename);

pipeline.reduce(function(a, next) {
  return a.pipe(next);
}, stream);
