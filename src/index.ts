import { Action } from './actions';
import { Event } from './events';

// For testing

const a = new Action((a: number) => a + 1);
const b = new Action((a: number) => `${a * 2}`);
const c = new Action((a: string) => a + '3');
const event = new Event<number, number>('sum');

const main = async () => {
  event.next(a).next(b).next(c);
  console.log(await event.execute(0));
};

main();
