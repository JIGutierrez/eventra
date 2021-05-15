import test from 'ava'
import sinon from 'sinon';
import { Action, Eventra } from '../src';


test('Event executes and compensates', async (t) => {
  const fn1 = sinon.fake();
  const fn2 = sinon.fake.throws(new Error());
  const fn1Compensate = sinon.fake();
  const fn2Compensate = sinon.fake();

  const action1 = Action.new(fn1).compensate(fn1Compensate);
  const action2 = Action.new(fn2).compensate(fn2Compensate);

  const event = Eventra.new<void, void>(action1).use(action2);
  await t.throwsAsync(event.execute());

  t.assert(fn1.calledOnce && fn2.calledOnce);

  t.assert(fn1Compensate.calledOnce && !fn2Compensate.called)

})

