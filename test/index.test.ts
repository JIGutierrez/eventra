import { Event, Action } from '../src/index';
import { Event as E } from '../src/events';
import { Action as A } from '../src/actions';
import test from 'ava';

test('Expect index to export all modules', (t) => {
  t.is(Event, E);
  t.is(Action, A);
});
