import test from 'ava';
import sinon from 'sinon';
import { Action } from '../src/actions'

const RANDOM_TEST_AMOUNT = 10;

test('Actions execute correctly', async (t) => {
  for (let i = 0; i < RANDOM_TEST_AMOUNT; i++) {
    const returnValue = Math.random() * 100;
    const fn = sinon.fake.returns(returnValue) as sinon.SinonSpy<void[], number>
    const action = Action.new<void, number>(fn);
    t.is(fn(), await action.execute())
  }
})