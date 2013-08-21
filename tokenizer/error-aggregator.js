var os = require('os');
var util = require('util');
var Token = require('./token');
var Transform = require('stream').Transform;
util.inherits(ErrorAggregator, Transform);

var p = ErrorAggregator.prototype;
p._transform = transform;
p._flush = flush;
p.joinErrors = joinErrors;

function ErrorAggregator(options) {
  Transform.call(this, options);
  this.errors = [];
  this.lastChunkWasError = false;
}

function transform(c, encoding, callback) {
  if( c.type === 'error' ) {
    this.lastChunkWasError = true;
    this.errors.push(c.value);
  } else {
    if( this.lastChunkWasError === true ) {
      this.joinErrors();
    }
    this.push(c);
    this.errors.splice(0);
  }
  callback();
}

function flush(callback) {
  if( this.errors.length > 0 ) {
    this.joinErrors();
  }
  callback();
}

function joinErrors() {
  var value = this.errors.join('');
  this.push(Token.create({value: value, length: value.length, type: 'error'}));
  this.lastChunkWasError = false;
}

module.exports = ErrorAggregator;
