var Transform = require('stream').Transform;

var p = Tokenizer.prototype;
p._transform = transform;
p._flush = flush;

function ObjectTokenizer(options) {
  Transform.call(this, options);
}

function transform(chunk, encoding, callback) {
  callback();
}

function flush(chunk, encoding, callback) {
  callback();
}

module.exports = ObjectTokenizer;
