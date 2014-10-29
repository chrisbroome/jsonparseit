'use strict';

module.exports = {
  object: [
    ['{', '}'],
    ['{', 'members', '}']
  ],
  members: [
    ['pair'],
    ['pair', ',', 'members']
  ],
  pair: [
    ['string', ':', 'value']
  ],
  array: [
    ['[', ']'],
    ['[', 'elements', ']']
  ],
  elements: [
    ['value'],
    ['value', ',', 'elements']
  ],
  value: [
    ['null'],
    ['true'],
    ['false'],
    ['string'],
    ['number'],
    ['object'],
    ['array']
  ],
  string: [
    ['"', '"'],
    ['"', 'chars', '"']
  ],
  chars: [
    ['"'],
    ['chars']
  ]
};
var firstSets = {
  object: ['{'],
  members: ['pair'],
  pair: ['string'],
  array: ['['],
  elements: ['value'],
  value: ['string', 'number', 'object', 'array', 'true', 'false', 'null'],
  string: ['"'],
  chars: ['"', 'chars'],
  number: ['number'],
  true: ['true'],
  false: ['false'],
  null: ['null']
};
