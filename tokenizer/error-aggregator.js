var os = require('os');
var util = require('util');
var Token = require('./token');
var Transform = require('stream').Transform;
util.inherits(ErrorAggregator, Transform);

var p = ErrorAggregator.prototype;
p._transform = transform;
p._flush = flush;
p.joinErrors = joinErrors;
p.position = 0;

function ErrorAggregator(options) {
  options = options || {};
  options.objectMode = true;
  Transform.call(this, options);
  this.position = 0;
  this.errors = [];
  this.lastChunkWasError = false;
}

function transform(c, encoding, callback) {
  if( c.type === 'error' ) {
    this.lastChunkWasError = true;
    this.errors.push(c);
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
  var position = this.errors[0].position;
  var value = this.errors.reduce(function(a, c){ return a + c.value; }, '');
  var t = Token.create({value: value, length: value.length, type: 'error', position: position});
  this.emit('errorAggregate', t);
  this.push(t);
  this.lastChunkWasError = false;
}

module.exports = ErrorAggregator;
