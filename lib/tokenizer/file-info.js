/**
 * @constructor
 * @param {Number} [position=0]
 * @param {Number} [line=1]
 * @param {Number} [column=0]
 */
function FileInfo(position, line, column) {
  this.position = position || 0;
  this.line = line || 1;
  this.column = column || 0;
}
/**
 * @param {Number} length The number of characters to seek by
 * @param {Boolean} [nl] Whether or not this is a new line
 * @returns {FileInfo}
 */
FileInfo.prototype.seek = function(length, nl) {
  var fi = this, position = fi.position + length;
  return nl ?
    new FileInfo(position, fi.line + 1, 0) :
    new FileInfo(position, fi.line, fi.column + length);
};
FileInfo.prototype.toString = function() {
  return this.line + ':' + this.column;
};

/**
 * @type {FileInfo}
 */
module.exports = FileInfo;
