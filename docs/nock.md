---
id: nock
title: Using Nock
sidebar_label: Using Nock
---

[`nock`](https://www.github.com/nock/nock) is a popular tool for HTTP(S) testing in JavaScript.

Unmock ️❤️ nock, and we've drawn a lot of inspiration for our project from their design decision and fluid API. To use unmock with nock, simply wrap your call to `nock` in `unmock`. It's that easy!  Here is a small example that uses the `nock` wrapper.


```javascript
import nock from "nock";
import unmock, { compose, u } from "unmock";

const MY_REPLY = {
    id: 101,
    name: 'Jane Doe',
    age: 42,
    type: 'user'
  }
unmock(nock)("https://www.myapi.com")
  .get('/users/42')
  .reply(200, MY_REPLY);

test("user from backend is correct as UI object", async () => {
  unmock.on();
  const { data } = await userAsUIObject(id);
  expect(data).toEqual(MY_REPLY);
});
```

By default, Unmock preserves `nock` functionality, including hardcoded response values. If possible, you should gradually transition from using hardcoded requests and responses in your tests.