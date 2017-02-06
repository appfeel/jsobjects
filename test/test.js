/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import { expect } from 'chai';

import { expandPath, getObjectByPath, updateObjectByPath } from '../';

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

describe('Util', () => {
    describe('expandPath', () => {
        it('arrstr', () => expect(expandPath(object, 'arrstr')).to.deep.equal(['arrstr.0', 'arrstr.1']));
        it('arrobj', () => expect(expandPath(object, 'arrobj.*')).to.deep.equal(['arrobj.0', 'arrobj.1']));

        it('arrstr.*', () => expect(expandPath(object, 'arrstr.*')).to.deep.equal(['arrstr.0', 'arrstr.1']));
        it('arrobj.*', () => expect(expandPath(object, 'arrobj.*')).to.deep.equal(['arrobj.0', 'arrobj.1']));

        it('obj.objarrstr.*', () => expect(expandPath(object, 'obj.objarrstr.*')).to.deep.equal(['obj.objarrstr.0', 'obj.objarrstr.1']));
        it('obj.objarrobj.*', () => expect(expandPath(object, 'obj.objarrobj.*')).to.deep.equal(['obj.objarrobj.0', 'obj.objarrobj.1']));

        it('obj.objarrobj.*.arrobjkey1', () => expect(expandPath(object, 'obj.objarrobj.*.arrobjkey1')).to.deep.equal(['obj.objarrobj.0.arrobjkey1', 'obj.objarrobj.1.arrobjkey1']));
        it('obj.objarrobj.*.["arr obj key 2"]', () => expect(expandPath(object, 'obj.objarrobj.*.["arr obj key 2"]')).to.deep.equal(['obj.objarrobj.0.["arr obj key 2"]', 'obj.objarrobj.1.["arr obj key 2"]']));

        it('arr.*', () => expect(expandPath(object, 'arr.*')).to.deep.equal(['arr.0', 'arr.1']));

        it('arr.*.arrkey1', () => expect(expandPath(object, 'arr.*.arrkey1')).to.deep.equal(['arr.0.arrkey1', 'arr.1.arrkey1']));
        it('arr.*.["arr key 2"]', () => expect(expandPath(object, 'arr.*.["arr key 2"]')).to.deep.equal(['arr.0.["arr key 2"]', 'arr.1.["arr key 2"]']));

        it('arr.*.arrarrstr', () => expect(expandPath(object, 'arr.*.arrarrstr')).to.deep.equal(['arr.0.arrarrstr', 'arr.1.arrarrstr']));
        it('arr.*.arrarrstr.*', () => expect(expandPath(object, 'arr.*.arrarrstr.*')).to.deep.equal(['arr.0.arrarrstr.0', 'arr.0.arrarrstr.1', 'arr.1.arrarrstr.0', 'arr.1.arrarrstr.1']));
        it('arr.*.arrarrobj.*', () => expect(expandPath(object, 'arr.*.arrarrobj.*')).to.deep.equal(['arr.0.arrarrobj.0', 'arr.0.arrarrobj.1', 'arr.1.arrarrobj.0', 'arr.1.arrarrobj.1']));

        it('arr.*.arrarrobj.*.arrkey1', () => expect(expandPath(object, 'arr.*.arrarrobj.*.arrkey1')).to.deep.equal(['arr.0.arrarrobj.0.arrkey1', 'arr.0.arrarrobj.1.arrkey1', 'arr.1.arrarrobj.0.arrkey1', 'arr.1.arrarrobj.1.arrkey1']));
        it('arr.*.arrarrobj.*.["arr key 2"]', () => expect(expandPath(object, 'arr.*.arrarrobj.*.["arr key 2"]')).to.deep.equal(['arr.0.arrarrobj.0.["arr key 2"]', 'arr.0.arrarrobj.1.["arr key 2"]', 'arr.1.arrarrobj.0.["arr key 2"]', 'arr.1.arrarrobj.1.["arr key 2"]']));

        it('no path provided', () => expect(expandPath(object)).to.deep.equal([]));
        it('empty provided', () => expect(expandPath(object, '')).to.deep.equal([]));
        it('unexistingkey', () => expect(expandPath(object, 'unexistingkey')).to.deep.equal([]));
        it('unexistingkey.*', () => expect(expandPath(object, 'unexistingkey.*')).to.deep.equal([]));
        it('arr.*.unexistingkey', () => expect(expandPath(object, 'arr.*.unexistingkey')).to.deep.equal(['arr.0.unexistingkey', 'arr.1.unexistingkey']));
        it('arr.*.unexistingkey.*', () => expect(expandPath(object, 'arr.*.unexistingkey.*')).to.deep.equal([]));


        it('arr.*.arrarrstr, callback', () => {
            const cb = sinon.spy();
            expect(expandPath(object, 'arr.*.arrarrstr', cb)).to.deep.equal(['arr.0.arrarrstr', 'arr.1.arrarrstr']);
            sinon.assert.calledTwice(cb);
            expect(cb.getCall(0).args).to.deep.equal(['arr.0.arrarrstr', ['string 1', 'string 2']]);
            expect(cb.getCall(1).args).to.deep.equal(['arr.1.arrarrstr', ['string 1', 'string 2']]);
        });

        it('arr.*.arrarrstr.*, callback', () => {
            const cb = sinon.spy();
            expect(expandPath(object, 'arr.*.arrarrstr.*', cb)).to.deep.equal(['arr.0.arrarrstr.0', 'arr.0.arrarrstr.1', 'arr.1.arrarrstr.0', 'arr.1.arrarrstr.1']);
            sinon.assert.callCount(cb, 4);
            expect(cb.getCall(0).args).to.deep.equal(['arr.0.arrarrstr.0', 'string 1']);
            expect(cb.getCall(1).args).to.deep.equal(['arr.0.arrarrstr.1', 'string 2']);
            expect(cb.getCall(2).args).to.deep.equal(['arr.1.arrarrstr.0', 'string 1']);
            expect(cb.getCall(3).args).to.deep.equal(['arr.1.arrarrstr.1', 'string 2']);
        });
    });

    describe('getObjectByPath', () => {
        it('key1', () => expect(getObjectByPath(object, 'key1')).to.be.equal(object.key1));
        it('object["key 2"]', () => expect(getObjectByPath(object, 'key 2')).to.be.equal(object['key 2']));

        it('arrstr.0', () => expect(getObjectByPath(object, 'arrstr.0')).to.be.equal(object.arrstr[0]));
        it('arrstr.1', () => expect(getObjectByPath(object, 'arrstr.1')).to.be.equal(object.arrstr[1]));
        it('arrstr.*, * = 0', () => expect(getObjectByPath(object, 'arrstr.*', [0])).to.be.equal(object.arrstr[0]));
        it('arrstr.*, * = 1', () => expect(getObjectByPath(object, 'arrstr.*', [1])).to.be.equal(object.arrstr[1]));

        it('arrobj.0.arrobjkey1', () => expect(getObjectByPath(object, 'arrobj.0.arrobjkey1')).to.be.equal(object.arrobj[0].arrobjkey1));
        it('arrobj.0.["arr obj key 2"]', () => expect(getObjectByPath(object, 'arrobj.0.["arr obj key 2"]')).to.be.equal(object.arrobj[0]['arr obj key 2']));
        it('arrobj.1.arrobjkey1', () => expect(getObjectByPath(object, 'arrobj.1.arrobjkey1')).to.be.equal(object.arrobj[1].arrobjkey1));
        it('arrobj.1.["arr obj key 2"]', () => expect(getObjectByPath(object, 'arrobj.1.["arr obj key 2"]')).to.be.equal(object.arrobj[1]['arr obj key 2']));

        it('arrobj.*.arrobjkey1, * = 0', () => expect(getObjectByPath(object, 'arrobj.*.arrobjkey1', [0])).to.be.equal(object.arrobj[0].arrobjkey1));
        it('arrobj.*.["arr obj key 2"], * = 0', () => expect(getObjectByPath(object, 'arrobj.*.["arr obj key 2"]', [0])).to.be.equal(object.arrobj[0]['arr obj key 2']));
        it('arrobj.*.arrobjkey1, * = 1', () => expect(getObjectByPath(object, 'arrobj.*.arrobjkey1', [1])).to.be.equal(object.arrobj[1].arrobjkey1));
        it('arrobj.*.["arr obj key 2"], * = 1', () => expect(getObjectByPath(object, 'arrobj.*.["arr obj key 2"]', [1])).to.be.equal(object.arrobj[1]['arr obj key 2']));

        it('obj.objkey1', () => expect(getObjectByPath(object, 'obj.objkey1')).to.be.equal(object.obj.objkey1));
        it('obj.["obj key 2"]', () => expect(getObjectByPath(object, 'obj.["obj key 2"]')).to.be.equal(object.obj['obj key 2']));

        it('obj.objarrstr.0', () => expect(getObjectByPath(object, 'obj.objarrstr.0')).to.be.equal(object.obj.objarrstr[0]));
        it('obj.objarrstr.1', () => expect(getObjectByPath(object, 'obj.objarrstr.1')).to.be.equal(object.obj.objarrstr[1]));
        it('obj.objarrstr.*, * = 0', () => expect(getObjectByPath(object, 'obj.objarrstr.*', [0])).to.be.equal(object.obj.objarrstr[0]));
        it('obj.objarrstr.*, * = 1', () => expect(getObjectByPath(object, 'obj.objarrstr.*', [1])).to.be.equal(object.obj.objarrstr[1]));

        it('obj.objarrobj.0.arrobjkey1', () => expect(getObjectByPath(object, 'obj.objarrobj.0.arrobjkey1')).to.be.equal(object.obj.objarrobj[0].arrobjkey1));
        it('obj.objarrobj.1.arrobjkey1', () => expect(getObjectByPath(object, 'obj.objarrobj.1.arrobjkey1')).to.be.equal(object.obj.objarrobj[1].arrobjkey1));
        it('obj.objarrobj.*.arrobjkey1, * = 0', () => expect(getObjectByPath(object, 'obj.objarrobj.*.arrobjkey1', [0])).to.be.equal(object.obj.objarrobj[0].arrobjkey1));
        it('obj.objarrobj.*.arrobjkey1, * = 1', () => expect(getObjectByPath(object, 'obj.objarrobj.*.arrobjkey1', [1])).to.be.equal(object.obj.objarrobj[1].arrobjkey1));


        it('arr.0.arrkey1', () => expect(getObjectByPath(object, 'arr.0.arrkey1')).to.be.equal(object.arr[0].arrkey1));
        it('arr.0.["arr key 2"]', () => expect(getObjectByPath(object, 'arr.0.["arr key 2"]')).to.be.equal(object.arr[0]['arr key 2']));
        it('arr.1.arrkey1', () => expect(getObjectByPath(object, 'arr.1.arrkey1')).to.be.equal(object.arr[1].arrkey1));
        it('arr.1.["arr key 2"]', () => expect(getObjectByPath(object, 'arr.1.["arr key 2"]')).to.be.equal(object.arr[1]['arr key 2']));
        it('arr.*.arrkey1, * = 0', () => expect(getObjectByPath(object, 'arr.*.arrkey1', [0])).to.be.equal(object.arr[0].arrkey1));
        it('arr.*.["arr key 2"], * = 0', () => expect(getObjectByPath(object, 'arr.*.["arr key 2"]', [0])).to.be.equal(object.arr[0]['arr key 2']));
        it('arr.*.arrkey1', () => expect(getObjectByPath(object, 'arr.*.arrkey1', [1])).to.be.equal(object.arr[1].arrkey1));
        it('arr.*.["arr key 2"]', () => expect(getObjectByPath(object, 'arr.*.["arr key 2"]', [1])).to.be.equal(object.arr[1]['arr key 2']));

        it('arr.0.arrarrstr.0', () => expect(getObjectByPath(object, 'arr.0.arrarrstr.0')).to.be.equal(object.arr[0].arrarrstr[0]));
        it('arr.0.arrarrstr.1', () => expect(getObjectByPath(object, 'arr.0.arrarrstr.1')).to.be.equal(object.arr[0].arrarrstr[1]));
        it('arr.1.arrarrstr.0', () => expect(getObjectByPath(object, 'arr.1.arrarrstr.0')).to.be.equal(object.arr[1].arrarrstr[0]));
        it('arr.1.arrarrstr.1', () => expect(getObjectByPath(object, 'arr.1.arrarrstr.1')).to.be.equal(object.arr[1].arrarrstr[1]));
        it('arr.*.arrarrstr.*, * = 0, 0', () => expect(getObjectByPath(object, 'arr.*.arrarrstr.*', [0, 0])).to.be.equal(object.arr[0].arrarrstr[0]));
        it('arr.*.arrarrstr.*, * = 0, 1', () => expect(getObjectByPath(object, 'arr.*.arrarrstr.*', [0, 1])).to.be.equal(object.arr[0].arrarrstr[1]));
        it('arr.*.arrarrstr.*, * = 1, 0', () => expect(getObjectByPath(object, 'arr.*.arrarrstr.*', [1, 0])).to.be.equal(object.arr[1].arrarrstr[0]));
        it('arr.*.arrarrstr.*, * = 1, 1', () => expect(getObjectByPath(object, 'arr.*.arrarrstr.*', [1, 1])).to.be.equal(object.arr[1].arrarrstr[1]));

        it('arr.0.arrarrobj.0.arrobjkey1', () => expect(getObjectByPath(object, 'arr.0.arrarrobj.0.arrobjkey1')).to.be.equal(object.arr[0].arrarrobj[0].arrobjkey1));
        it('arr.0.arrarrobj.1.["arr obj key 2"]', () => expect(getObjectByPath(object, 'arr.0.arrarrobj.1.["arr obj key 2"]')).to.be.equal(object.arr[0].arrarrobj[1]['arr obj key 2']));
        it('arr.1.arrarrobj.0.arrobjkey1', () => expect(getObjectByPath(object, 'arr.1.arrarrobj.0.arrobjkey1')).to.be.equal(object.arr[1].arrarrobj[0].arrobjkey1));
        it('arr.1.arrarrobj.1.["arr obj key 2"]', () => expect(getObjectByPath(object, 'arr.1.arrarrobj.1.["arr obj key 2"]')).to.be.equal(object.arr[1].arrarrobj[1]['arr obj key 2']));
        it('arr.*.arrarrobj.*.arrobjkey1, * = 0, 0', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.arrobjkey1', [0, 0])).to.be.equal(object.arr[0].arrarrobj[0].arrobjkey1));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 0, 1', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [0, 1])).to.be.equal(object.arr[0].arrarrobj[1]['arr obj key 2']));
        it('arr.*.arrarrobj.*.arrobjkey1, * = 1, 0', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.arrobjkey1', [1, 0])).to.be.equal(object.arr[1].arrarrobj[0].arrobjkey1));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1])).to.be.equal(object.arr[1].arrarrobj[1]['arr obj key 2']));

        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset 1', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 1)).to.be.equal(object.arr[1].arrarrobj[1]));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset 2', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 2)).to.be.equal(object.arr[1].arrarrobj));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset 3', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 3)).to.be.equal(object.arr[1]));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset 4', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 4)).to.be.equal(object.arr));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset 5', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 5)).to.be.equal(object));
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1, offset bigger than path length (10)', () => expect(getObjectByPath(object, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1], 10)).to.be.equal(object));

        it('unexistingkey', () => expect(getObjectByPath(object, 'unexistingkey')).to.be.null);
        it('unexistingkey.unexistingkey', () => expect(getObjectByPath(object, 'unexistingkey.unexistingkey')).to.be.null);
    });

    describe('updateObjectByPath', () => {
        let newObject;

        beforeEach(() => {
            newObject = Object.assign({}, object);
        });

        it('key1', () => {
            updateObjectByPath(newObject, 'key1', 'new value');
            expect(getObjectByPath(newObject, 'key1')).to.be.equal('new value');
        });
        it('object["key 2"]', () => {
            updateObjectByPath(newObject, 'key 2', 'new value');
            expect(getObjectByPath(newObject, 'key 2')).to.be.equal('new value');
        });

        it('arrstr.0', () => {
            updateObjectByPath(newObject, 'arrstr.0', 'new value');
            expect(getObjectByPath(newObject, 'arrstr.0')).to.be.equal('new value');
        });
        it('arrstr.1', () => {
            updateObjectByPath(newObject, 'arrstr.1', 'new value');
            expect(getObjectByPath(newObject, 'arrstr.1')).to.be.equal('new value');
        });
        it('arrstr.*, * = 0', () => {
            updateObjectByPath(newObject, 'arrstr.*', 'new value', [0]);
            expect(getObjectByPath(newObject, 'arrstr.*', [0])).to.be.equal('new value');
        });
        it('arrstr.*, * = 1', () => {
            updateObjectByPath(newObject, 'arrstr.*', 'new value', [1]);
            expect(getObjectByPath(newObject, 'arrstr.*', [1])).to.be.equal('new value');
        });

        it('arrobj.0.arrobjkey1', () => {
            updateObjectByPath(newObject, 'arrobj.0.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'arrobj.0.arrobjkey1')).to.be.equal('new value');
        });
        it('arrobj.0.["arr obj key 2"]', () => {
            updateObjectByPath(newObject, 'arrobj.0.["arr obj key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arrobj.0.["arr obj key 2"]')).to.be.equal('new value');
        });
        it('arrobj.1.arrobjkey1', () => {
            updateObjectByPath(newObject, 'arrobj.1.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'arrobj.1.arrobjkey1')).to.be.equal('new value');
        });
        it('arrobj.1.["arr obj key 2"]', () => {
            updateObjectByPath(newObject, 'arrobj.1.["arr obj key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arrobj.1.["arr obj key 2"]')).to.be.equal('new value');
        });

        it('arrobj.*.arrobjkey1, * = 0', () => {
            updateObjectByPath(newObject, 'arrobj.*.arrobjkey1', 'new value', [0]);
            expect(getObjectByPath(newObject, 'arrobj.*.arrobjkey1', [0])).to.be.equal('new value');
        });
        it('arrobj.*.["arr obj key 2"], * = 0', () => {
            updateObjectByPath(newObject, 'arrobj.*.["arr obj key 2"]', 'new value', [0]);
            expect(getObjectByPath(newObject, 'arrobj.*.["arr obj key 2"]', [0])).to.be.equal('new value');
        });
        it('arrobj.*.arrobjkey1, * = 1', () => {
            updateObjectByPath(newObject, 'arrobj.*.arrobjkey1', 'new value', [1]);
            expect(getObjectByPath(newObject, 'arrobj.*.arrobjkey1', [1])).to.be.equal('new value');
        });
        it('arrobj.*.["arr obj key 2"], * = 1', () => {
            updateObjectByPath(newObject, 'arrobj.*.["arr obj key 2"]', 'new value', [1]);
            expect(getObjectByPath(newObject, 'arrobj.*.["arr obj key 2"]', [1])).to.be.equal('new value');
        });

        it('obj.objkey1', () => {
            updateObjectByPath(newObject, 'obj.objkey1', 'new value');
            expect(getObjectByPath(newObject, 'obj.objkey1')).to.be.equal('new value');
        });
        it('obj.["obj key 2"]', () => {
            updateObjectByPath(newObject, 'obj.["obj key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'obj.["obj key 2"]')).to.be.equal('new value');
        });

        it('obj.objarrstr.0', () => {
            updateObjectByPath(newObject, 'obj.objarrstr.0', 'new value');
            expect(getObjectByPath(newObject, 'obj.objarrstr.0')).to.be.equal('new value');
        });
        it('obj.objarrstr.1', () => {
            updateObjectByPath(newObject, 'obj.objarrstr.1', 'new value');
            expect(getObjectByPath(newObject, 'obj.objarrstr.1')).to.be.equal('new value');
        });
        it('obj.objarrstr.*, * = 0', () => {
            updateObjectByPath(newObject, 'obj.objarrstr.*', 'new value', [0]);
            expect(getObjectByPath(newObject, 'obj.objarrstr.*', [0])).to.be.equal('new value');
        });
        it('obj.objarrstr.*, * = 1', () => {
            updateObjectByPath(newObject, 'obj.objarrstr.*', 'new value', [1]);
            expect(getObjectByPath(newObject, 'obj.objarrstr.*', [1])).to.be.equal('new value');
        });

        it('obj.objarrobj.0.arrobjkey1', () => {
            updateObjectByPath(newObject, 'obj.objarrobj.0.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'obj.objarrobj.0.arrobjkey1')).to.be.equal('new value');
        });
        it('obj.objarrobj.1.arrobjkey1', () => {
            updateObjectByPath(newObject, 'obj.objarrobj.1.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'obj.objarrobj.1.arrobjkey1')).to.be.equal('new value');
        });
        it('obj.objarrobj.*.arrobjkey1, * = 0', () => {
            updateObjectByPath(newObject, 'obj.objarrobj.*.arrobjkey1', 'new value', [0]);
            expect(getObjectByPath(newObject, 'obj.objarrobj.*.arrobjkey1', [0])).to.be.equal('new value');
        });
        it('obj.objarrobj.*.arrobjkey1, * = 1', () => {
            updateObjectByPath(newObject, 'obj.objarrobj.*.arrobjkey1', 'new value', [1]);
            expect(getObjectByPath(newObject, 'obj.objarrobj.*.arrobjkey1', [1])).to.be.equal('new value');
        });


        it('arr.0.arrkey1', () => {
            updateObjectByPath(newObject, 'arr.0.arrkey1', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.arrkey1')).to.be.equal('new value');
        });
        it('arr.0.["arr key 2"]', () => {
            updateObjectByPath(newObject, 'arr.0.["arr key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.["arr key 2"]')).to.be.equal('new value');
        });
        it('arr.1.arrkey1', () => {
            updateObjectByPath(newObject, 'arr.1.arrkey1', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.arrkey1')).to.be.equal('new value');
        });
        it('arr.1.["arr key 2"]', () => {
            updateObjectByPath(newObject, 'arr.1.["arr key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.["arr key 2"]')).to.be.equal('new value');
        });
        it('arr.*.arrkey1, * = 0', () => {
            updateObjectByPath(newObject, 'arr.*.arrkey1', 'new value', [0]);
            expect(getObjectByPath(newObject, 'arr.*.arrkey1', [0])).to.be.equal('new value');
        });
        it('arr.*.["arr key 2"], * = 0', () => {
            updateObjectByPath(newObject, 'arr.*.["arr key 2"]', 'new value', [0]);
            expect(getObjectByPath(newObject, 'arr.*.["arr key 2"]', [0])).to.be.equal('new value');
        });
        it('arr.*.arrkey1', () => {
            updateObjectByPath(newObject, 'arr.*.arrkey1', 'new value', [1]);
            expect(getObjectByPath(newObject, 'arr.*.arrkey1', [1])).to.be.equal('new value');
        });
        it('arr.*.["arr key 2"]', () => {
            updateObjectByPath(newObject, 'arr.*.["arr key 2"]', 'new value', [1]);
            expect(getObjectByPath(newObject, 'arr.*.["arr key 2"]', [1])).to.be.equal('new value');
        });

        it('arr.0.arrarrstr.0', () => {
            updateObjectByPath(newObject, 'arr.0.arrarrstr.0', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.arrarrstr.0')).to.be.equal('new value');
        });
        it('arr.0.arrarrstr.1', () => {
            updateObjectByPath(newObject, 'arr.0.arrarrstr.1', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.arrarrstr.1')).to.be.equal('new value');
        });
        it('arr.1.arrarrstr.0', () => {
            updateObjectByPath(newObject, 'arr.1.arrarrstr.0', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.arrarrstr.0')).to.be.equal('new value');
        });
        it('arr.1.arrarrstr.1', () => {
            updateObjectByPath(newObject, 'arr.1.arrarrstr.1', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.arrarrstr.1')).to.be.equal('new value');
        });
        it('arr.*.arrarrstr.*, * = 0, 0', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrstr.*', 'new value', [0, 0]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrstr.*', [0, 0])).to.be.equal('new value');
        });
        it('arr.*.arrarrstr.*, * = 0, 1', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrstr.*', 'new value', [0, 1]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrstr.*', [0, 1])).to.be.equal('new value');
        });
        it('arr.*.arrarrstr.*, * = 1, 0', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrstr.*', 'new value', [1, 0]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrstr.*', [1, 0])).to.be.equal('new value');
        });
        it('arr.*.arrarrstr.*, * = 1, 1', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrstr.*', 'new value', [1, 1]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrstr.*', [1, 1])).to.be.equal('new value');
        });

        it('arr.0.arrarrobj.0.arrobjkey1', () => {
            updateObjectByPath(newObject, 'arr.0.arrarrobj.0.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.arrarrobj.0.arrobjkey1')).to.be.equal('new value');
        });
        it('arr.0.arrarrobj.1.["arr obj key 2"]', () => {
            updateObjectByPath(newObject, 'arr.0.arrarrobj.1.["arr obj key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arr.0.arrarrobj.1.["arr obj key 2"]')).to.be.equal('new value');
        });
        it('arr.1.arrarrobj.0.arrobjkey1', () => {
            updateObjectByPath(newObject, 'arr.1.arrarrobj.0.arrobjkey1', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.arrarrobj.0.arrobjkey1')).to.be.equal('new value');
        });
        it('arr.1.arrarrobj.1.["arr obj key 2"]', () => {
            updateObjectByPath(newObject, 'arr.1.arrarrobj.1.["arr obj key 2"]', 'new value');
            expect(getObjectByPath(newObject, 'arr.1.arrarrobj.1.["arr obj key 2"]')).to.be.equal('new value');
        });
        it('arr.*.arrarrobj.*.arrobjkey1, * = 0, 0', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrobj.*.arrobjkey1', 'new value', [0, 0]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrobj.*.arrobjkey1', [0, 0])).to.be.equal('new value');
        });
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 0, 1', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrobj.*.["arr obj key 2"]', 'new value', [0, 1]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrobj.*.["arr obj key 2"]', [0, 1])).to.be.equal('new value');
        });
        it('arr.*.arrarrobj.*.arrobjkey1, * = 1, 0', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrobj.*.arrobjkey1', 'new value', [1, 0]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrobj.*.arrobjkey1', [1, 0])).to.be.equal('new value');
        });
        it('arr.*.arrarrobj.*.["arr obj key 2"], * = 1, 1', () => {
            updateObjectByPath(newObject, 'arr.*.arrarrobj.*.["arr obj key 2"]', 'new value', [1, 1]);
            expect(getObjectByPath(newObject, 'arr.*.arrarrobj.*.["arr obj key 2"]', [1, 1])).to.be.equal('new value');
        });

        it('unexistingkey', () => {
            updateObjectByPath(newObject, 'unexistingkey', 'new value');
            expect(getObjectByPath(newObject, 'unexistingkey')).to.be.equal('new value');
        });
        it('unexistingkey.unexistingkey', () => {
            updateObjectByPath(newObject, 'unexistingkey.unexistingkey', 'new value');
            expect(getObjectByPath(newObject, 'unexistingkey.unexistingkey')).to.be.null;
        });
    });
});
