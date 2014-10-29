'use strict';

module.exports = Tree;

// single instance of a null node to save memory
var NULL_NODE = null;

function TreeNode(value, left, right) {
  this.value = value;
  this.left = left || NULL_NODE;
  this.right = right || NULL_NODE;
}
TreeNode.prototype = {

  toString: function toString() {
    return '(' + getNodeString(this.left) + ',' + this.value + ',' + getNodeString(this.right) + ')';
  }

};

function getNodeString(treeNode) {
  return treeNode === NULL_NODE ? '' : treeNode.toString();
}

function Tree(options) {
  var opts = options || {};
  this.root = null;
}
Tree.TreeNode = TreeNode;
Tree.prototype = {

  isEmpty: function isEmpty() {
    return this.root === null;
  },

  insertLeft: function insertLeft(node) {
    if (this.root === NULL_NODE) this.root = node;
    else this.insertLeft(this.root.left);
    return node;
  },

  toString: function toString() {
  }

};

function nullValueFunction(left, right) {
  return null;
}
