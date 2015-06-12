'use strict';

import immutable from 'immutable';
import dp from 'dpath';
import events from 'events';
import stampit from 'stampit';
import Rx from 'rx';

const irecord = function (obj) {
  let stamp, instance;

  const history = [];

  const state = function () {
    return history[history.length - 1];
  };

  const update = function update (value) {
    if (state() === value) return;

    const previous = state();

    history.push(value);
    instance.emit('change', {value, previous});
  };

  history.push(immutable.fromJS(obj));

  stamp =
    stampit.convertConstructor(events.EventEmitter)
    .methods({
      get (key) {
        return state().getIn(dp(key));
      },
      set (key, val) {
        update(state().setIn(dp(key), val));
        return this;
      },
      updateIn (key, fn) {
        return update(state().updateIn(dp(key), fn));
      },
      remove (key) {
        update(state().removeIn(dp(key)));
        return this;
      },
      toJS () {
        return state().toJS();
      }
    })
    .enclose(function () {
      const source = Rx.Observable.fromEvent(
        this, 'change',
        (ev) => ev[0]);

      this.subscribe = source.subscribe.bind(source);
      this.filter = source.filter.bind(source);
    });

  instance = stamp.create();

  return stampit.extend(
    instance,
    { stamp }
  );
};

export default irecord;
