# sync-primitives

[![build status](https://img.shields.io/travis/fanatid/sync-primitives.svg?branch=master&style=flat-square)](http://travis-ci.org/fanatid/sync-primitives)
[![Coverage Status](https://img.shields.io/coveralls/fanatid/sync-primitives.svg?style=flat-square)](https://coveralls.io/r/fanatid/sync-primitives)
[![Dependency status](https://img.shields.io/david/fanatid/sync-primitives.svg?style=flat-square)](https://david-dm.org/fanatid/sync-primitives#info=dependencies)
[![Dev Dependency status](https://img.shields.io/david/fanatid/sync-primitives.svg?style=flat-square)](https://david-dm.org/fanatid/sync-primitives#info=devDependencies)

[![NPM](https://nodei.co/npm/sync-primitives.png?downloads=true)](https://www.npmjs.com/package/sync-primitives)
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

```
npm install sync-primitives
```

## Initialization

sync-primitives uses [promises](https://promisesaplus.com/) but doesn't have hard dependencies on the specific library.

You can use [embedded promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [bluebird](https://github.com/petkaantonov/bluebird), [Q](https://github.com/kriskowal/q), [lie](https://github.com/calvinmetcalf/lie), [promise polyfill](https://github.com/jakearchibald/es6-promise) or [other promise library](https://www.npmjs.com/search?q=promises).

All what you need just call module with specific promise object:

```js
var Promise = require('bluebird')
var makeConcurrent = require('sync-primitives')(Promise)
```

## API

  * [Semaphore](#semaphore)
  * [Condition](#condition)
  * [Event](#event)
  * [Barrier](#barrier)

### Semaphore

#### constructor

  * `number` [value=1]

#### acquire

  * `Object` [opts]
    * `boolean` [blocking=true]
    * `boolean` [timeout=-1]

**return**: `Promise<boolean>`

#### release

#### withLock

  * `function` fn
  * `Object` [opts]
    * `boolean` [blocking=true]
    * `boolean` [timeout=-1]

**return**: `Promise<[boolean, *]>`

### Condition
...

### Event
...

### Barrier
...

## License

Code released under [the MIT license](https://github.com/fanatid/sync-primitives/blob/master/LICENSE).
