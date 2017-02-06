(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsobjects = require('./lib/jsobjects');

Object.keys(_jsobjects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jsobjects[key];
    }
  });
});

},{"./lib/jsobjects":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

// http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
var getObjectByPath = exports.getObjectByPath = function getObjectByPath(obj, path, pathReplacements, offset) {
    var replacements = (pathReplacements || []).slice(0); // Don't touch my array!
    var normalizedPath = path.replace(/^\./, ''); // strip a leading dot
    var pathArray = normalizedPath.split('.');
    var pathArrayLen = pathArray.length - (offset || 0);
    var i = void 0;
    var key = void 0;

    for (i = 0; i < pathArrayLen; i += 1) {
        key = pathArray[i].replace(/\['(.*)'\]/g, '$1').replace(/\["(.*)"\]/g, '$1'); // convert indexes to properties
        if (key === '*' && replacements && replacements.length) {
            key = replacements.shift();
        }

        if (key in obj) {
            obj = obj[key]; // eslint-disable-line no-param-reassign
        } else {
            return null;
        }
    }

    return obj;
};

/**
 * Converteix 'attrs.*.options.*.dn.*.ap' en
 * Array [
 *     "attrs.0.options.0.dn.0.ap",
 *     "attrs.0.options.0.dn.1.ap",
 *     "attrs.0.options.1.dn.0.ap",
 *     "attrs.0.options.2.dn.0.ap",
 *     "attrs.1.options.0.dn.0.ap",
 *     "attrs.1.options.1.dn.0.ap"
 * ]
 */
var expandPath = exports.expandPath = function expandPath(obj, path) {
    var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {
        return b;
    };

    var parts = (path || '').split('.*.');
    var partsLen = parts.length;
    var expandedPaths = [];
    var i = void 0;
    var pathParts = void 0;
    var expandPathPart = function expandPathPart(partIdx) {
        return function (pathPart) {
            var objPath = [];
            pathPart = pathPart.replace(/\.\*$/i, ''); // eslint-disable-line no-param-reassign
            try {
                objPath = getObjectByPath(obj, pathPart);
            } catch (e) {} // eslint-disable-line no-empty

            (objPath || []).forEach(function (item, index) {
                var newPath = pathPart + '.' + index;
                newPath = parts[partIdx] ? newPath + '.' + parts[partIdx].replace(/\.\*$/i, '') : newPath;
                if (partIdx === parts.length - 1) {
                    if (/\.\*$/ig.test(parts[partIdx])) {
                        var objPath1 = [];
                        try {
                            objPath1 = getObjectByPath(obj, newPath);
                        } catch (e) {} // eslint-disable-line no-empty
                        newPath = newPath.replace('.*', '');
                        (objPath1 || []).forEach(function (item1, index1) {
                            expandedPaths.push(newPath + '.' + index1);
                            cb(newPath + '.' + index1, item1);
                        });
                    } else {
                        expandedPaths.push(newPath);
                        var objPath2 = [];
                        try {
                            objPath2 = getObjectByPath(obj, newPath);
                        } catch (e) {} // eslint-disable-line no-empty
                        cb(newPath, objPath2);
                    }
                } else {
                    expandedPaths.push(newPath);
                }
            });
        };
    };
    pathParts = [parts[0]];

    if (partsLen === 1) {
        expandPathPart(1)(pathParts[0]);
    } else {
        for (i = 1; i < partsLen; i += 1) {
            if (expandedPaths.length) {
                pathParts = expandedPaths;
                expandedPaths = [];
            }
            pathParts.forEach(expandPathPart(i));
        }
    }

    return expandedPaths;
};

var updateObjectByPath = exports.updateObjectByPath = function updateObjectByPath(obj, path, newValue, pathReplacements) {
    var normalizedPath = path.replace(/^\./, '');
    var lastKey = normalizedPath.split('.').slice(-1)[0];
    try {
        var selectedObject = getObjectByPath(obj, path, pathReplacements, 1);
        selectedObject[lastKey.replace(/'/g, '').replace(/(\['|\["|'\]|"\])/g, '')] = newValue;
    } catch (e) {} // eslint-disable-line no-empty
    return obj;
};

},{}]},{},[1]);
