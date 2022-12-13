import { Retry } from '../src/retry';
import { Eventra, Action } from '../src';
import test from 'ava';

const RETRY_AMOUNT = 3;
const DELAY_AMOUNT = 100;

async function runRetry(retry: () => Promise<boolean>) {
  let iTime = Date.now();
  await retry();
  let fTime = Date.now();
  let deltaTime = fTime - iTime;
  return deltaTime;
}

test('Retry function built and executes correctly', async (t) => {
  let i = 0;
  const retry = Retry.new({
    amount: RETRY_AMOUNT,
    custom: () => {
      i++;
      return true;
    },
    delay: DELAY_AMOUNT,
  });

  for (let j = 0; j < RETRY_AMOUNT; j++) {
    let deltaTime = await runRetry(retry);
    console.log(deltaTime);
    t.assert(Math.abs(deltaTime - DELAY_AMOUNT) < 10); // 10 second accuracy for sleep
  }

  t.assert(i === RETRY_AMOUNT);

  let deltaTime = await runRetry(retry);
  t.assert(deltaTime < DELAY_AMOUNT);
});

test('Retry doesnt re-run if future actions fail', async (t) => {
  const retry = Retry.new({
    amount: RETRY_AMOUNT,
    delay: DELAY_AMOUNT,
  });

  let i = 0;
  const event = Eventra.new(
    Action.new(() => {
      i++;
    }).retry(retry)
  ).use(
    Action.new(() => {
      throw new Error();
    })
  );

  try {
    await event.execute(null);
  } catch {}

  t.is(i, 1);
});
