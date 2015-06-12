'use strict';

import test from 'tape';
import irecord from '../index.js';

test('.subscribe', (assert) => {
  assert.plan(3);

  const original = {
    a: 'a',
    b: 'b'
  };
  const record = irecord(original);

  record.subscribe(
    ({ value, previous }) => {
      assert.pass('should emit change events.');

      assert.deepEqual(value.toJS(), {
        a: 'a',
        b: 'b',
        c: 'c'
      }, 'new value should be passed.');

      assert.deepEqual(previous.toJS(), original,
        'previous value should be passed.');

    },
    (err) => { assert.fail('err: ' + err); },
    () => { assert.pass('complete'); }
  );

  record.set('c', 'c');
});

test('.filter', (assert) => {
  assert.plan(1);

  const original = {
    a: 'a',
    b: 'b'
  };
  const record = irecord(original);

  record.filter(({value}) => {
    return value.toJS().c === 'again';
  }).subscribe(({ value }) => {
    assert.equal(value.toJS().c, 'again',
      "should filter out changes that don't match the predicate");
  });

  record.set('a', 'changed');
  record.set('c', 'c');
  record.set('c', 'again');
  assert.end();
});
