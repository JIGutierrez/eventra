import test from 'ava'
import sinon from 'sinon';
import { Action, Event } from '../src';

test('Events execute all actions once', async (t) => {
  const function1 = sinon.fake();
  const function2 = sinon.fake();

  let action1 = Action.new(function1);
  let action2 = Action.new(function2);

  const event = Event.new('', action1).use(action2);
  await event.execute('any');

  t.assert(function1.calledOnce && function2.calledOnce);
})