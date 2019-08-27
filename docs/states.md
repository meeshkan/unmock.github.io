---
id: states
title: Setting the State
sidebar_label: Setting the State
---

Sometimes, it is not enough to verify that a function handles any old API response correctly. You'll often want to verify that a function reacts to *specific data* from an API in a predictable way. There are two ways to do this:

1. Hardcode return values for API simualtions. This is **bad**.
1. Override generic API specs on a per-test basis. This is **good** when done in moderation. Too much of this is **bad**, and if you find a lot of these in your code base, you should try [property testing](property.md) instead.

To do the second one, Unmock exposes a **state** property for each service.

## Modifying a response body

The most common override you will need to make when you are testing is modifying a response body to contain a specific field.

### JSON response

There are two ways to modify response bodies with content type `application/json`.

1. **Global override**. Override a field in *every* response.
1. **Path override**. Override a field corresponding to a specific path.
1. **Path-verb override**. Override a field corresponding to a specific path *and* verb.

The example below contains examples of all three.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.test.js

import unmock, { compose, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.foo.com")
  .get("/users/{id}")
  .reply(200, { name: u.name.firstName, paid: u.boolean });
unmock("https://www.bar.com")
  .get("/users/{id}")
  .reply(200, { paid: u.boolean, horoscope: u.zodiac.horoscope });
unmock("https://www.baz.com")
  .get("/users/{id}")
  .reply(200, { paid: u.boolean, latitude: u.location.latitude });

test("user from backend is correct as UI object", async () => {
  const { foo, bar, baz } = unmock.on();
  const paid = true;
  foo.state({ paid });
  bar.state("/users/42", { paid });
  baz.state.get("/users/42", { paid });
  const info = await userAsUIObject(42);
  expect(info.foo).toBe(foo.spy.getResponseBody());
  expect(info.bar).toBe(bar.spy.getResponseBody());
  expect(info.baz).toBe(baz.spy.getResponseBody());
});
```

<!--Code-->
```javascript
// userAsUIObject.js
const userAsUIObject = async (id) => {
  const foo = await axios("https://www.foo.com/users/"+id);
  const bar = await axios("https://www.bar.com/users/"+id);
  const baz = await axios("https://www.baz.com/users/"+id);
  return {
    foo: foo.data.paid ? foo.data : undefined,
    bar: bar.data.paid ? bar.data : undefined,
    baz: baz.data.paid ? baz.data : undefined
  }
}
export default userAsUIObject;
```

<!--END_DOCUSAURUS_CODE_TABS-->


> You can also use wildcards for single path item replacements:
>
> ```javascript
> github.state("/users/*", { name: "lucy" });
> ```

### Text response

If the service returns content type of `text/plain` and you want to set a specific text response, you can replace the object inputs above with plain strings.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// getAString.test.js

import unmock, { compose, u } from "unmock";
import getAString from "./userAsUIObject";

unmock("https://www.foo.com")
  .get("/users/{id}")
  .textReply(200);

test("user from backend is correct as UI object", async () => {
  const { foo } = unmock.on();
  const anti_pattern = "This is a bad test.";
  foo.state(anti_pattern);
  const s = await getAString(42);
  // the better test would be to test that s is a string
  // but hey, sometimes anti-patterns get the job done!
  expect(s).toBe(anti_pattern);
});
```

<!--Code-->
```javascript
// getAString.js
const getAString = async (id) => {
  const { data } = await axios("https://www.foo.com/api/users/"+id);
  return data;
}
export default getAString;
```

<!--END_DOCUSAURUS_CODE_TABS-->

### Using a function as state

In rare cases, you'll want to set the response body programmatically based on the intercepted request. This can be done by using a function as state input as follows:

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// is42.test.js

import unmock, { u } from "unmock";
import is42 from "./is42";

unmock("https://www.is42.com")
  .get("/{n}")
  .reply(200, { ok: u.boolean });

test("user from backend is correct as UI object", async () => {
  const { is42 } = unmock.on();
  is42.state(req => {
    body: {
      ok: req.path.indexOf("42") !== -1 true : false
    }});
  const i42 = await is42(42);
  expect(i42).toBe({ ok: true });
});
```

<!--Code-->
```javascript
// is42.js
const is42 = async (n) => {
  const { data } = await axios("https://www.is42.com/"+n);
  return data;
}
export default is42;
```

<!--END_DOCUSAURUS_CODE_TABS-->

Note that the object returned from the function must be a _full_ `UnmockResponse`.

```javascript
{
  statusCode: 200, // a number, defaults to 200 if not present
  body: {}, // a body, a string or an object if application/json
  headers: {} // optional headers
}
```

> Danger! Too much logic in your tests is bad. If you find yourself using functions a lot, you should try [property testing](property.md). If that doesn't work, consider refactoring your code. If that doesn't work, let us know, because you have an interesting use case!

The request object contains the following fields:

- `host`: request hostname, for example, `"api.github.com"`
- `headers`: request headers
- `body`: request body
- `method`: request method, for example, `"GET"`
- `protocol`: either `"http"` or `"https"`
- `path`: the **unparsed** request path, including the query string

## Resetting the state

You can reset a specific service state or the whole service.

```javascript
github.state.reset(); // Reset the state for `github`
github.reset(); // Reset the service, including state
```

## Fluent API

The `state` object exposes a fluent API so you can chain multiple calls to set multiple states.

```javascript
github.state
  .get("/users/sparky", { name: "Still Sparky" })
  .get("/users/lilo", { name: "Lilo" });
```
