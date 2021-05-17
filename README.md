# Eventra

## Usage

```ts
import { Action } from './actions';
import { Event } from './events';

const a = new Action((a: number) => a + 1);
a.compensate((n) => n - 1);
const b = new Action((a: number) => `${a * 2}`);
b.compensate((s) => parseInt(s) / 2);
const c = new Action((a: string) => a + '3');
c.compensate((s) => s.slice(0, s.length - 1));
const d = new Action((s: string) => {
  if (Math.random() < 0.1) {
    return 'Holi' + s;
  }
  throw new Error('error');
});

const main = async () => {
  let event = Event.new('sum', a).use(b).use(c).use(d);

  try {
    const result = await event.execute(0);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
};

main();
```

## Todo list:

- Document properly
- Testing
- Retry function maker for common use cases (timeouts, number of retries)
