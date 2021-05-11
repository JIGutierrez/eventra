# Eventra

## Usage

```ts
const retryFunction = () => {
  let i = 0;
  return (err: Error) => {
    return ++i <= 3;
  };
};

const a = new Action((a: number) => a + 1);
a.compensate((n) => n - 1);

const b = new Action((a: number) => `${a * 2}`);
b.compensate((s) => parseInt(s) / 2);

const c = new Action((s: string) => {
  if (Math.random() < 0.1) {
    return 'Number: ' + s;
  }
  throw new Error('Random error!');
});

c.retry(retryFunction());

const main = async () => {
  let event = Event.new('sum', a).use(b).use(c);
  try {
    const result = await event.execute(0);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
};
```
