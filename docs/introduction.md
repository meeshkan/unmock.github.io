---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Unmock is a JavaScript library for API integration testing. It helps programmers focus more on documenting the business logic of their integrations and less on reverse engineering the logic behind these integrations.

Below is an example of the type of test you will never write again once you start using unmock.

```ts
import testlib from "some-integration-test-library";

const USER = {id: 3521, name: "Amy Smith", zodiac: "Libra" }
beforeEach(() => {
  testlib
    .get("https://example.com/user/3521")
    .code(200)
    .return(USER);
});

test("my user function returns a user", async () => {
  const user = await userFunction(3521);
  expect(user).toEqual(USER);
});
```

The issue with tests like the one above is that they are confirming how a reversed-engineered API behaves without documenting why an integration exists or what needs to happen as part of that integration. Unmock fixes this by focusing on four essential questions:

1. Does my code correctly transform the input and output of network calls?
2. Does my code account for all the ways an external API may behave?
3. Does my code trigger the correct side effects (ie calls to analytics libraries, loggers, etc)?
4. Do my tests function as a spec that will help future maintainers understand the code's intent?

This documentation covers these four questions in four separate sections. But first, below, it rolls them all into one sucinct example.

## How it works

```javascript
// user.test.js
import unmock from "unmock-node"; // ES6
// const unmock = require("unmock-node").default;  // CommonJS

// Activate unmock to intercept all outgoing traffic
const states = unmock.on();

test("returns correct response", async () => {
  states.github({ id: 1 }); // Modify `github` service to return "id" 1
  const fetchResult = await fetch("https://api.github.com/user"); // Fetch data
  expect(fetchResult.json().id).toBe(1);
});
```

If the snippet above is our "Hello World", we also provide a set of slightly more robust [examples](examples.md) that can get you started depending on your need and use case.

## Next steps

1. Get started with a [Hello World example](hello.md)
1. [Install](installation.md) unmock
1. Learn about [services](layout.md)