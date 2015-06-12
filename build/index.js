'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _dpath = require('dpath');

var _dpath2 = _interopRequireDefault(_dpath);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var irecord = function irecord(obj) {
  var stamp = undefined,
      instance = undefined;

  var history = [];

  var state = function state() {
    return history[history.length - 1];
  };

  var update = function update(value) {
    if (state() === value) return;

    var previous = state();

    history.push(value);
    instance.emit('change', { value: value, previous: previous });
  };

  history.push(_immutable2['default'].fromJS(obj));

  stamp = _stampit2['default'].convertConstructor(_events2['default'].EventEmitter).methods({
    get: function get(key) {
      return state().getIn((0, _dpath2['default'])(key));
    },
    set: function set(key, val) {
      update(state().setIn((0, _dpath2['default'])(key), val));
      return this;
    },
    updateIn: function updateIn(key, fn) {
      return update(state().updateIn((0, _dpath2['default'])(key), fn));
    },
    remove: function remove(key) {
      update(state().removeIn((0, _dpath2['default'])(key)));
      return this;
    },
    toJS: function toJS() {
      return state().toJS();
    }
  }).enclose(function () {
    var source = _rx2['default'].Observable.fromEvent(this, 'change', function (ev) {
      return ev[0];
    });

    this.subscribe = source.subscribe.bind(source);
    this.filter = source.filter.bind(source);
  });

  instance = stamp.create();

  return _stampit2['default'].extend(instance, { stamp: stamp });
};

exports['default'] = irecord;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map