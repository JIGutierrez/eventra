import test from 'ava';
import sinon from 'sinon';
import { Action } from '../src/actions'

const RANDOM_TEST_AMOUNT = 10;
const TEST_RESULT = 1

test('Actions execute correctly', async (t) => {
  for (let i = 0; i < RANDOM_TEST_AMOUNT; i++) {
    const returnValue = Math.random() * 100;
    const fn = sinon.fake.returns(returnValue) as sinon.SinonSpy<void[], number>
    const action = Action.new<void, number>(fn);
    t.is(fn(), await action.execute())
  }
})

test('Actions throw', async (t) => {
  const fn = sinon.fake.throws(new Error());
  const action = Action.new<void, void>(fn);
  await t.throwsAsync(action.execute());
})

test('Actions retry', async (t) => {
  const fn = () => {
    let i = 0;
    return () => {
      if (i === 0) {
        i++;
        throw new Error()
      }
      return TEST_RESULT;
    }
  };
  const retry = sinon.fake.returns(true);
  const action = Action.new<void, number>(fn()).retry(retry);
  const result = await action.execute();

  t.is(result, TEST_RESULT)
  t.assert(retry.calledOnce)

})