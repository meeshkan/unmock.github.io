---
id: nock
title: Nock
sidebar_label: Nock
---

[`nock`](https://www.github.com/nock/nock) is a popular tool for HTTP(S) testing in JavaScript.

Unmock ️❤️ nock, and we've drawn a lot of inspiration for our project from their design decision and fluid API. To use unmock with nock, simply wrap your call to `nock` in `unmock`. It's that easy!  Here is our original Hello World example, written using the `nock` wrapper.


```javascript
import nock from "nock";
import unmock, { compose, u } from "unmock";

unmock(nock)("https://www.myapi.com")
  .get('/users/42')
  .reply(200, {
    id: 101,
    name: 'Jane Doe',
    age: 42,
    type: 'user'
  });

test("user from backend is correct as UI object", async () => {
  stack = unmock.on();
  const { myapi } = stack;
  compose(myapi.success(), [u.int], async (id) => { /* 2 below */
    const user = await userAsUIObject(id);
    stack(expect).getOnce("https://www.example.com/api/users/");
    const { body } = myapi.response;
    stack(expect)(user).toExtend(myapi.body()); /* 1 below */
    stack(expect).postOnce("https://www.analytics.com", { id: body.id }); /* 3 below */
    stack(expect)(user.welcomeMessage).toBe(`Hello ${user.name}!`)
  });
});
```

By default, Unmock preserves `nock` functionality, including hardcoded response values. If possible, you should gradually transition from using hardcoded requests and responses in your tests. To do this, Unmock provides a `convert` utility that converts a file from `nock` to native Unmock syntax while preserving functionality. From there, you can slowly transition to dynamic return values.