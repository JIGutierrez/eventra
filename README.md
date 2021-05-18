# Eventra

![npm bundle size](https://img.shields.io/bundlephobia/min/eventra)

## Installation

```
npm install eventra
```

## Usage

```ts
import { Action, Eventra, Retry } from 'eventra';

// This is just for demonstrative purposes. Please don't create users this way.

// Interfaces, arbitrary functions and errors. --------------------------------

interface myUserInterface {
  username: string;
}

interface myUserInterfaceWithId extends myUserInterface {
  id: number;
}

const postToUserMicroservice = async (data: myUserInterfaceWithId) => {
  /* ... */
};
const deleteFromUserMicroservice = async (data: myUserInterfaceWithId) => {
  /*...*/
};

class MyHandledError extends Error {}

// Action declaration ---------------------------------------------------------

let lastUserId = 134;

const updateUserCount = Action.new((userData: myUserInterface) => {
  lastUserId++;
  return { ...userData, id: lastUserId };
}).compensate(() => {
  lastUserId--;
});

const writeToMicroservice = Action.new(
  async (userData: myUserInterfaceWithId) => {
    await postToUserMicroservice(userData);
    return userData;
  }
)
  .retry(
    Retry.new({
      amount: 3,
      delay: 100,
      custom: (err) => {
        if (err instanceof MyHandledError) {
          return true;
        }
        return false;
      },
    })
  )
  .compensate(async (userData) => {
    await deleteFromUserMicroservice(userData.id);
  });

const greetUser = Action.new((data: myUserInterfaceWithId) => {
  console.log(`Hello, ${data.username}!`);
});

// Event declaration ----------------------------------------------------------

const createUserEvent = Eventra.new(updateUserCount)
  .use(writeToMicroservice)
  .use(greetUser);

// Event execution ------------------------------------------------------------

await createUserEvent.execute({ username: 'John' });
```

In a real word scenario, it's recommended to split these up into separate files, typically executing the Eventra instance within a web server route, for instance.
