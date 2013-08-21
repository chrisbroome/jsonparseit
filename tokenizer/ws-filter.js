var os = require('os');
var util = require('util');
var Token = require('./token');
var Transform = require('stream').Transform;
util.inherits(WsFilter, Transform);

var p = WsFilter.prototype;
p._transform = transform;
p._flush = flush;

function WsFilter(options) {
  Transform.call(this, options);
}

function transform(c, encoding, callback) {
  if( c.type !== 'ws' ) {
    this.push(c);
  }
  callback();
}

function flush(callback) {
  callback();
}

module.exports = WsFilter;
