import { Retry } from '../src/retry';
import test from 'ava';

const RETRY_AMOUNT = 2;
const DELAY_AMOUNT = 10;

async function runRetry(retry: () => Promise<boolean>) {
  let iTime = Date.now();
  let result = await retry();
  let fTime = Date.now();
  let deltaTime = fTime - iTime;
  return {
    result,
    deltaTime
  }
}

test('Retry function built and executes correctly', async (t) => {
  let i = 0
  const retry = Retry.new({
    amount: RETRY_AMOUNT,
    custom: () => {
      i++;
      return (i >= RETRY_AMOUNT)
    },
    delay: DELAY_AMOUNT
  });

  const results: boolean[] = [false, true]

  for (let j = 0; j < RETRY_AMOUNT; j++) {
    let { result, deltaTime } = await runRetry(retry)
    t.assert(deltaTime >= DELAY_AMOUNT);
    t.assert(result === results[j]);
  }

  let { result, deltaTime } = await runRetry(retry);
  t.assert(deltaTime < DELAY_AMOUNT);
  t.false(result)

})