'use strict';

import test from 'tape';
import irecord from '../index.js';

test('immutable', (assert) => {
  const original = {
    a: 'a',
    b: 'b'
  };
  const record = irecord(original);

  record.set('c', 'c');

  assert.deepEqual(original, {
    a: 'a',
    b: 'b'
  }, 'should not mutate original');

  assert.end();
});

test('deep immutability', (assert) => {
  const original = {
    a: 'a',
    b: ['thing', 'otherThing']
  };
  const record = irecord(original);

  record.updateIn('b', function (arr){
    return arr.push('thirdThing');
  });

  assert.deepEqual(original, {
    a: 'a',
    b: ['thing', 'otherThing']
  }, 'should not mutate original deep array');

  assert.end();
});


test('change events', (assert) => {
  assert.plan(3);

  const original = {
    a: 'a',
    b: 'b'
  };
  const record = irecord(original);

  record.on('change', ({ value, previous }) => {
    assert.pass('should emit change events.');

    assert.deepEqual(value.toJS(), {
      a: 'a',
      b: 'b',
      c: 'c'
    }, 'new value should be passed.');

    assert.deepEqual(previous.toJS(), original,
      'previous value should be passed.');

  });

  record.set('c', 'c');
});

test('.get()', (assert) => {
  const record = irecord({
    a: 'a',
    b: 'b'
  });

  assert.equal(record.get('a'), 'a',
    '.get() should return a value for the specified key.');

  assert.end();
});


test('.set()', (assert) => {
  const record = irecord({
    a: 'a',
    b: 'b'
  });

  record.set('c', 'c');

  assert.equal(record.get('c'), 'c',
    '.set() should set the value for the specified key');

  assert.end();
});

test('.set() & .get() deep', assert => {
  const record = irecord({});
  record.set('a.b.c', 'val');

  assert.deepEqual(record.get('a.b.c'), 'val',
    'passing "a.b.c" as the key should set deep in the record.');

  assert.end();
});

test('.updateIn() deep', (assert) => {
  const original = {
    a: 'a',
    b: ['thing', 'otherThing']
  };
  const record = irecord(original);

  record.updateIn('b', function (arr){
    return arr.push('thirdThing');
  });

  assert.deepEqual(record.get('b.2'), 'thirdThing',
   'passing a transform function to a deep array key should set deep record');

  assert.end();
});

test('.toJS', (assert) => {
  const obj = {
    a: 'a',
    b: 'b'
  };

  const record = irecord(obj);

  const obj2 = record.toJS();

  assert.deepEqual(obj, obj2,
    '.toJS() should return a JS object');

  assert.end();
});


test('.remove()', (assert) => {
  const record = irecord({
    a: 'a',
    b: 'b'
  });

  record.remove('b');

  assert.equal(record.get('b'), undefined,
    '.remove() should remove the key passed in');

  assert.end();
});
