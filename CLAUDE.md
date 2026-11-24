# CLAUDE.md

This file guides Claude Code (claude.ai/code) when it works on code in this repository.

## Project

`jsonparseit` is a streaming JSON tokenizer/parser built on Node's `stream.Transform` API. It is an exploratory, work-in-progress project. Tokenizing is done by the author's companion package [`lexit`](https://www.npmjs.com/package/lexit), and this repo provides the JSON terminal definitions, token classes, a recursive-descent parser, and AST node classes.

## Commands

```sh
npm install
npm test          # parse test/fixtures/test.json and print the AST
npm run bigtest   # parse test/fixtures/all.json
npm start         # parse ./package.json
node ./test/index.js <file.json>   # parse any file (reads stdin if no file is given)
```

There is no assertion-based test framework, linter, or build step. `test/index.js` is a demo harness: it pipes a file through the pipeline and prints the AST (`util.inspect`), a tokenizer summary, and the token and error counts. To check a change, run `npm test` / `npm run bigtest` and read the output, including any `parser:error` lines.

## Architecture

Pipeline, as wired up in `test/index.js`:

```
fs.ReadStream → lexit.Tokenizer(terminalList) → whitespace filter → RecursiveDescentParser → output
```

- **`lib/terminal-list.js`**: a `lexit.TerminalList` of `[type, regex]` pairs. Order matters, because earlier entries win. `ws` deliberately excludes `\n` (newlines are a separate `nl` token) so line counts stay accurate. Matches are turned into tokens by `token-factory.js`.
- **`lib/token-factory.js`** and **`lib/tokens/`**: map terminal type → token class (subclasses of `lexit.Token`). Types not in the table fall back to the base `Token`. For example, `StringToken` pulls its value from `match[2]`, so changing capture groups in the string regex affects it.
- **`lib/recursive-descent-parser.js`**: an object-mode `Transform`. `_transform` buffers every non-`ws`/`nl` token, and all the parsing happens in `_flush` (so it is not truly incremental). It starts at `value()` and then checks for end of input. Errors are collected in `this._errors` (via `error()`, which returns `false`) rather than thrown. If any errors were collected, the `'error'` event is emitted once with the array. The parser then pushes the tree root as its single output object.
  - `parseContainer` / `parseContainerMembers` handle both objects and arrays generically, using the node's `open`/`close`/`sep` properties and a member-handler method name (`'pair'` or `'value'`).
  - `parseTerminal(NodeCtor)` relies on a **static** `NodeCtor.type` (for example `StringNode.type = 'string'`). Any new terminal node class needs it.
  - The `assert*` helpers are built from `expectToken(test, ErrorCtor)` plus `applyNew`. Error constructor arguments are `expectationArgs` followed by the token.
- **`lib/nodes/`**: the AST. Hierarchy: `NodeBase` → `ValueNode` → `TerminalNode` → (`String|Number|True|False|Null`)`Node`, and `NodeBase` → `ContainerNode` → `ObjectNode` / `ArrayNode` (with `items`). `PairNode` has `key`/`value`.
- **`lib/errors/`**: `ErrorBase` subclasses (`TypeMismatchError`, `InvalidValueError`, `EndOfInputError`, `UnexpectedEndOfInputError`).
- **`lib/grammar.js`**: a declarative description of the JSON grammar. It is exported but **not used** by the parser, which is hand-written.
- **Barrel files** (`lib/errors.js`, `lib/nodes.js`, `lib/tokens.js`) and `index.js` re-export the modules. When you add a new module, add it to the matching barrel.

## Conventions

- ES5-style CommonJS: `var`, constructor functions, `util.inherits`, and prototype methods attached with `_.extend`. Most files start with `'use strict'`. Match this style rather than introducing classes, `const`/`let`, or ESM.
- One class per file, in kebab-case filenames, with JSDoc `@constructor` / `@type` annotations. Files typically put `module.exports` near the top, which relies on function hoisting.

## Gotchas

- `EmptyStringToken` exists, but it is commented out of the token table. Empty strings `""` are matched by a separate `string` terminal instead.
