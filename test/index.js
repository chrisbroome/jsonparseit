var
  util = require('util'),
  fs = require('fs'),
  stream = require('stream'),
  lexit = require('lexit'),
  jsonParser = require('../');

(function main() {

  var
    inputStream = getInputStream(),
    tokenizer = getTokenizer(jsonParser.terminalList),
    whitespaceFilter = getWhitespaceFilter(),
    parser = getRecursiveDescentParserStream(),
    output = getOutputStream(tokenizer, parser);

  inputStream.pipe(tokenizer)
    .pipe(whitespaceFilter)
    .pipe(parser)
    .pipe(output)
    .pipe(process.stdout);

}());

function getWhitespaceFilter() {
  var filter = stream.Transform({objectMode: true});
  filter._transform = function(token, encoding, cb) {
    if (token.type === 'nl' || token.type === 'ws') return cb();
    this.push(token);
    this.emit('token', token);
    cb();
  };
  filter._flush = function(cb) {
    cb();
  };
  filter.on('error', function(err) {
    console.error('filter:error');
    console.error(err);
  });
  return filter;
}

function getOutputStream(tokenizer, parser) {
  var output = stream.Transform({writableObjectMode: true});
  output.treeRoot = null;
  output._transform = function(treeRoot, encoding, cb) {
    this.treeRoot = treeRoot;
    cb();
  };
  output._flush = function(cb) {
    var errors = parser.getErrors();
    this.push(util.inspect(this.treeRoot, {colors: true, depth: null}) + '\n');
    this.push(tokenizer.toString());
    this.push('Parsed ' + parser._tokenPointer + ' tokens. ' + errors.length + ' errors.\n');
    cb();
  };
  output.on('error', function(err) {
    console.error('output:error');
    console.error(err);
  });
  return output;
}

function getRecursiveDescentParserStream() {
  var Parser = jsonParser.RecursiveDescentParser;
  var parser = new Parser;
  parser.on('error', function(err) {
    var errors = parser.getErrors();
    console.error('parser:error');
    console.error(err);
    console.log('Parsed ' + parser._tokenPointer + ' tokens. ' + errors.length + ' errors.');
  });
  return parser;
}

function getInputStream() {
  var
    filename = process.argv[2],
    inputStream = filename ? fs.createReadStream(filename) : process.stdin;

  inputStream.on('error', function(err) {
    console.error('inputStream:error');
    console.error(err);
  });

  return inputStream;
}

/**
 * @param {TerminalList} terminalList
 * @return {lexit.Tokenizer}
 */
function getTokenizer(terminalList) {
  var tokenizer = new lexit.Tokenizer(terminalList);

  tokenizer.on('error', function(err) {
    console.error('tokenizer:error');
    console.error(err);
  });

  return tokenizer;
}
