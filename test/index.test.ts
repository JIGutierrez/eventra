import { Eventra, Action } from '../src/index';
import { Eventra as E } from '../src/events';
import { Action as A } from '../src/actions';
import test from 'ava';

test('Expect index to export all modules', (t) => {
  t.is(Eventra, E);
  t.is(Action, A);
});
