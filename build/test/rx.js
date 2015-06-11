'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _indexJs = require('../index.js');

var _indexJs2 = _interopRequireDefault(_indexJs);

(0, _tape2['default'])('.subscribe', function (assert) {
  assert.plan(3);

  var original = {
    a: 'a',
    b: 'b'
  };
  var record = (0, _indexJs2['default'])(original);

  record.subscribe(function (_ref) {
    var value = _ref.value;
    var previous = _ref.previous;

    assert.pass('should emit change events.');

    assert.deepEqual(value.toJS(), {
      a: 'a',
      b: 'b',
      c: 'c'
    }, 'new value should be passed.');

    assert.deepEqual(previous.toJS(), original, 'previous value should be passed.');
  }, function (err) {
    assert.fail('err: ' + err);
  }, function () {
    assert.pass('complete');
  });

  record.set('c', 'c');
});

(0, _tape2['default'])('.filter', function (assert) {
  assert.plan(1);

  var original = {
    a: 'a',
    b: 'b'
  };
  var record = (0, _indexJs2['default'])(original);

  record.filter(function (_ref2) {
    var value = _ref2.value;

    return value.toJS().c === 'again';
  }).subscribe(function (_ref3) {
    var value = _ref3.value;

    assert.equal(value.toJS().c, 'again', 'should filter out changes that don\'t match the predicate');
  });

  record.set('a', 'changed');
  record.set('c', 'c');
  record.set('c', 'again');
  assert.end();
});