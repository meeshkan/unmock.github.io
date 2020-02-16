---
id: fuzz
title: Fuzz Testing
sidebar_label: Fuzz Testing
---

Because Unmock generates random responses, it is not very useful to test out only one. The real power of Unmock comes from testing many different outcomes of interactions with an API.  To do this, `unmock` supports fuzz testing, or the testing of multiple random outcomes, with the Unmock `runner`.

By default, the `runner` will run your test 20 times. In this example, we're importing a Jest configuration of the `runner` from a separate [`unmock-jest-runner`](https://github.com/meeshkan/unmock-jest-runner) package. 

```javascript
import unmock, { u, transform } from "unmock";
import runner from "unmock-jest-runner";
const { withCodes } = transform;

unmock
  .nock('https://api.myapi.com', 'myapi')
  .get('/user/{id}')
  .reply(200, {
    id: u.number(),
    name: u.string("name.firstName")
  })
  .get('/user/{id}')
  .reply(404, {
    message: "Naughty you!"
  })

const { myapi } = unmock.on().services;
myapi.state(withCodes(200));
test(() => runner(() => {
  // my test
}))
```

Runner generates a different response every time.  Had we not used `withCodes(200)`, `runner` would have randomly alternated between `200` and `404`.

