JSObjects
=========

This small library allows you to manipulate objects via string path. It can be used in node.js or browser or any place where javascript can be run.

![License: EUPL v1.1](http://img.shields.io/badge/License-EUPL_v1.1-blue.svg?style=flat)
[![NPM version](http://img.shields.io/npm/v/jsobjects.svg?style=flat)](https://npmjs.org/package/jsobjects)
[![Downloads](http://img.shields.io/npm/dm/jsobjects.svg?style=flat)](https://npmjs.org/package/jsobjects)
[![Build Status](https://travis-ci.org/appfeel/jsobjects.svg?branch=master)](https://travis-ci.org/appfeel/jsobjects)
[![Coverage Status](https://coveralls.io/repos/github/appfeel/jsobjects/badge.svg)](https://coveralls.io/github/appfeel/jsobjects)


## Node.js

```
npm i jsobjects --save
```

```js
import { expandPath, getObjectByPath, updateObjectByPath } from 'jsobjects';

// Will use this objects to show ussage in examples
const arrstr = ['string 1', 'string 2'];
const arrobj = [
    {
        arrobjkey1: 'arrobj1key1',
        'arr obj key 2': 'arr obj 1 key 2',
    },
    {
        arrobjkey1: 'arrobj2key1',
        'arr obj key 2': 'arr obj 2 key 2',
    },
];
const object = {
    key1: 'key1',
    'key 2': 'key 2',
    arrstr,
    arrobj,
    obj: {
        objkey1: 'objkey1',
        'obj key 2': 'obj key 2',
        objarrstr: arrstr,
        objarrobj: arrobj,
    },
    arr: [
        {
            arrkey1: 'arr1key1',
            'arr key 2': 'arr 1 key 2',
            arrarrstr: arrstr,
            arrarrobj: arrobj,
        },
        {
            arrkey1: 'arr2key1',
            'arr key 2': 'arr 2 key 2',
            arrarrstr: arrstr,
            arrarrobj: arrobj,
        },
    ],
};
```

## browser

```
bower install jsobjects --save
```

```html
<script src="bower_components/build/bundle.js"></script>
```

```js
// Will use this objects to show ussage in examples
var arrstr = ['string 1', 'string 2'];
var arrobj = [
    {
        arrobjkey1: 'arrobj1key1',
        'arr obj key 2': 'arr obj 1 key 2',
    },
    {
        arrobjkey1: 'arrobj2key1',
        'arr obj key 2': 'arr obj 2 key 2',
    },
];
var object = {
    key1: 'key1',
    'key 2': 'key 2',
    arrstr: arrstr,
    arrobj: arrobj,
    obj: {
        objkey1: 'objkey1',
        'obj key 2': 'obj key 2',
        objarrstr: arrstr,
        objarrobj: arrobj,
    },
    arr: [
        {
            arrkey1: 'arr1key1',
            'arr key 2': 'arr 1 key 2',
            arrarrstr: arrstr,
            arrarrobj: arrobj,
        },
        {
            arrkey1: 'arr2key1',
            'arr key 2': 'arr 2 key 2',
            arrarrstr: arrstr,
            arrarrobj: arrobj,
        },
    ],
};
```

# API

## getObjectByPath
`getObjectByPath(object, path, pathReplacements, offset)`

Given an object and a path or generic path, returns the value contained in the object at the specified path.

- `object`: The object to search for `path`
- `path`: The path to be expanded, accepts `.*` notation
- `pathReplacements`: Every `*` in path will be replaced by corresponding in pathReplacements array: `('arr.*.arrarrobj.*.arrkey1', [0, 1])` will be assimilated to `arr.0.arrarrobj.1.arrkey1`
- `offset`: Number of paths to skip at the end: `('arr.*.arrarrobj.*.arrkey1', [0, 1], 3)` will be assimilated to `arr.0`

#### Examples

```js

// These statements evals to true
getObjectByPath(object, 'arr.0.arrarrobj.0.arrobjkey1')                   === object.arr[0].arrarrobj[0].arrobjkey1;
getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [0, 1])    === object.arr[0].arrarrobj[1]['arr obj key 2'];
getObjectByPath(object, "arr.*.arrarrobj.*.['arr obj key 2']", [0, 1])    === object.arr[0].arrarrobj[1]['arr obj key 2'];
getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 1) === object.arr[1].arrarrobj[1];
```


## expandPath
`expandPath(object, path, callback)`

Given an object and a generic path, returns an array with all the paths found in the object.
Complex keys (not single word) allows to be refferenced with `["name of the key"]` or `['name of the key']`.

- `object`: The object to search for `path`
- `path`: The path to be expanded, accepts `.*` notation
- `callback`: (Optional) a callback function that will be called for each entry found


#### Examples

```js
expandPath(object, 'arrstr'); // will output: ['arrstr.0', 'arrstr.1'];
expandPath(object, 'arrobj.*'); // will output: ['arrstr.0', 'arrstr.1'];

expandPath(object, 'arrstr.*'); // will output: ['arrstr.0', 'arrstr.1']
expandPath(object, 'arrobj.*'); // will output: ['arrobj.0', 'arrobj.1']

expandPath(object, 'obj.objarrstr.*'); // will output: ['obj.objarrstr.0', 'obj.objarrstr.1']
expandPath(object, 'obj.objarrobj.*'); // will output: ['obj.objarrobj.0', 'obj.objarrobj.1']

expandPath(object, 'obj.objarrobj.*.arrobjkey1'); // will output: ['obj.objarrobj.0.arrobjkey1', 'obj.objarrobj.1.arrobjkey1']
expandPath(object, 'obj.objarrobj.*.["arr obj key 2"]'); // will output: ['obj.objarrobj.0.["arr obj key 2"]', 'obj.objarrobj.1.["arr obj key 2"]']

expandPath(object, 'arr.*'); // will output: ['arr.0', 'arr.1']

expandPath(object, 'arr.*.arrkey1'); // will output: ['arr.0.arrkey1', 'arr.1.arrkey1']
expandPath(object, 'arr.*.["arr key 2"]'); // will output: ['arr.0.["arr key 2"]', 'arr.1.["arr key 2"]']

expandPath(object, 'arr.*.arrarrstr'); // will output: ['arr.0.arrarrstr', 'arr.1.arrarrstr']
expandPath(object, 'arr.*.arrarrstr.*'); // will output: ['arr.0.arrarrstr.0', 'arr.0.arrarrstr.1', 'arr.1.arrarrstr.0', 'arr.1.arrarrstr.1']
expandPath(object, 'arr.*.arrarrobj.*'); // will output: ['arr.0.arrarrobj.0', 'arr.0.arrarrobj.1', 'arr.1.arrarrobj.0', 'arr.1.arrarrobj.1']

expandPath(object, 'arr.*.arrarrobj.*.arrkey1'); // will output: ['arr.0.arrarrobj.0.arrkey1', 'arr.0.arrarrobj.1.arrkey1', 'arr.1.arrarrobj.0.arrkey1', 'arr.1.arrarrobj.1.arrkey1']
expandPath(object, 'arr.*.arrarrobj.*.["arr key 2"]'); // will output: ['arr.0.arrarrobj.0.["arr key 2"]', 'arr.0.arrarrobj.1.["arr key 2"]', 'arr.1.arrarrobj.0.["arr key 2"]', 'arr.1.arrarrobj["arr key 2"]']));

expandPath(object); // will output: []
expandPath(object, ''); // will output: []
expandPath(object, 'unexistingkey'); // will output: []
expandPath(object, 'unexistingkey.*'); // will output: []
expandPath(object, 'arr.*.unexistingkey'); // will output: ['arr.0.unexistingkey', 'arr.1.unexistingkey']
expandPath(object, 'arr.*.unexistingkey.*'); // will output: []


expandPath(object, 'arr.*.arrarrstr', cb); // will output: ['arr.0.arrarrstr', 'arr.1.arrarrstr']
// cb function will be called twice with the followint arguments:
// First call: cb('arr.0.arrarrstr', ['string 1', 'string 2'])
// Second call: cb('arr.1.arrarrstr', ['string 1', 'string 2'])
```

## updateObjectByPath
`updateObjectByPath(object, path, newValue, pathReplacements)`

Update the object at a given path with a specified value.

- `object`: The object to search for `path`
- `path`: The path to be expanded, accepts `.*` notation
- `newValue`: The new value to be assigned
- `pathReplacements`: Every `*` in path will be replaced by corresponding in pathReplacements array: `('arr.*.arrarrobj.*.arrkey1', [0, 1])` will be assimilated to `arr.0.arrarrobj.1.arrkey1`

#### Examples

```js
updateObjectByPath(object, 'arrobj.*.arrobjkey1', 'new value', [1]);

// This statement evals to true
getObjectByPath(object, 'arrobj.*.arrobjkey1', [1]) === 'new value';
```

