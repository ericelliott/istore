'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _indexJs = require('../index.js');

var _indexJs2 = _interopRequireDefault(_indexJs);

(0, _tape2['default'])('stamp composition with irecord', function (assert) {
  assert.plan(1);

  var record = (0, _indexJs2['default'])({
    a: 'a',
    b: 'b'
  });

  var stamp = (0, _stampit2['default'])({
    countProps: function countProps() {
      return Object.keys(this.toJS()).length;
    }
  });

  var composedRecord = _stampit2['default'].compose(record.stamp, stamp).create();

  assert.equal(composedRecord.countProps(), 2, 'should expose irecord methods');
});