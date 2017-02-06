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

var jsobjects = require('jsobjects');

document.write('<h2>Given this object:</h2>');
document.write('<p><pre>' + JSON.stringify(object, undefined, 4) + '</pre></p>');
document.write('<h2>We can acces it with:</h2>');
document.write('<p><code>jsobjects.getObjectByPath(object, \'obj.objarrstr.0\'):</code> <strong><code>' + jsobjects.getObjectByPath(object, 'obj.objarrstr.0') + '</code></strong></p>');
document.write('<p><code>jsobjects.getObjectByPath(object, \'arr.0.arrarrobj.0.["arr obj key 2"]\'):</code> <strong><code>' + jsobjects.getObjectByPath(object, 'arr.0.arrarrobj.0.["arr obj key 2"]') + '</code></strong></p>');
document.write('<p><code>jsobjects.expandPath(object, \'arrobj.*\'):</code> <strong><code>' + jsobjects.expandPath(object, 'arrobj.*') + '</code></strong></p>');
