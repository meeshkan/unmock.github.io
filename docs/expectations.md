---
id: expectations
title: Great Expectations
sidebar_label: Great Expectations
---

Now that you know how to define services in Unmock, it would be useful to assert things about how they are used. When services are defined in Unmock, they automagically reside in the `unmock.services` object.

```javascript
const unmock = require('unmock');
unmock("https://api.myapi.com/v2/foo").serve({ hello: "world" });
const myapi = unmock.services.myapi;
```

> For Typescript users, services will be typed according to their specifications. Depending on how you define services, the type of the `unmock.services` object will sometimes fall out of sync with your service specifications. If/when this happens, run `unmock ts` from the CLI. It is a good idea to make `unmock ts` part of any compilation or build process.

These service objects contain lots of useful properties for you to write simple and effective tests.

## Spying

Unmock uses **[Sinon JS Spies](https://sinonjs.org/releases/v7.4.1/spies/)** to give you access to the number of times an API is called, its return value, and other bits of useful information. You can check out the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/) for more information on the types of assertions that can be made with spies.  The section below acts as a cookbook for writing great tests with spies.

Spies are properties of services.  So, for example, to get the spy for GitHub, you would call.

```javascript
const {
  services: { github },
} = unmock.on(); // Activate unmock and load services
const githubSpy = github.spy;
```

An unmock spy has all the properties documented in the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/). In addition to this, it has some useful functions that make retrieving the body of requests and responses easy.

## Working with bodies

To access the body of a response, use `spy.getBody()`, `spy.getBodyOf(match)` or `spy.getBodies(/* match */)`. `getBody()` will return one response body from a service and assert a) that the service was called; and b) that it was only called once. `getBodyOf(match)` works in a similar fashion but accepts a [SinonJS matcher](https://sinonjs.org/releases/v7.4.1/matchers/) as an argument. `getBodies()` returns all response bodies emitted, accepting an optional matcher for further refinements.

Here is a simple test that asserts the body of a response is part of a larger object returned by a function.

<!--DOCUSAURUS_CODE_TABS-->

<!--test-->
```javascript
// augmentedUser.test.js
import unmock, { services: { myapi }, u } from "unmock";
import getAugmentedUser from "./getAugmentedUser";
import sinon from "sinon";

unmock("https://myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.id,
    name: u.name.firstName,
    hobbies: u.array(u.enum("Fishing", "Swimming", "Reading"), { minValue: 1 })
  })

test("augmented user object composed correctly", async () => {
  const augmentedUser = await getAugmentedUser(42);
  expect(augmentedUser).toMatchObject(myapi.spy.getBody());
});

test("augmented user does not have race conditions", async () => {
  const augmentedUsers = Promise.all([getAugmentedUser(42), getAugmentedUser(43)]);
  expect(augmentedUsers[0]).toMatchObject(myapi.spy.getBodyOf(sinon.match({id: 42})));
  expect(augmentedUsers[1]).toMatchObject(myapi.spy.getBodyOf(sinon.match({id: 43})));
});
```

<!--code-->
```javascript
// augmentedUser.js
import axios from "axios";

export default async (id) => {
  const { data } = axios("https://myapi.com/users/"+id);
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false
  }
} 
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Using SinonJS assert

To use SinonJS assertions, import `sinon` from `unmock-node` or from `sinon` directly:

```javascript
import { sinon: { assert } } from "unmock-node";
// or import { assert } from "sinon";
```

With `sinon.assert`, you can make assertions about all sorts of things - the [number of times](https://sinonjs.org/releases/v7.4.1/assertions/#sinonassertcalledoncespy) an API is called, the [input](https://sinonjs.org/releases/v7.4.1/assertions/#sinonassertcalledwithspyorspycall-arg1-arg2-) or [output](https://sinonjs.org/releases/v7.4.1/spy-call/#spycallreturnvalue) of a call, etc.  The full documentation for SinonJS assertions can be found [here](https://sinonjs.org/releases/v7.4.1/assertions/).

The most important thing you'll need to know when working with Sinon assertions is how HTTP(S) requests and responses are represented.  For example, Sinon does not have methods like `calledWithPath` or `calledWithReturnCode`. To make assertions about things in HTTP-land like queries or headers, you need to use `UnmockRequest` and `UnmockResponse` objects.

### `UnmockRequest`

An `UnmockRequest` is an object with the following fields, all of which are optional. When used with `sinon`, the fields can be [Sinon matchers](https://sinonjs.org/releases/v7.4.1/matchers/), or the whole object can be enclosed in a matcher.

```javascript
{
  protocol: "", // the protocol, either http or https
  method: "", // the HTTP method (get, post, etc.)
  path: "", // the path that was called, with wildcard values in brackets
  query: {}, // the query, represented as key-value pairs
  header: {}, // the header, represented as key-value pairs
  body: {}, // the body, a JSON object if it is a form or json, otherwise a string
}
```

Here is how an Unmock request can be used in a test.


<!--DOCUSAURUS_CODE_TABS-->

<!--test-->
```javascript
// augmentedUser.test.js
import unmock, { services: { myapi }, u } from "unmock";
import getAugmentedUser from "./getAugmentedUser";
import { assert, match } from "sinon";

unmock("https://myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.id,
    name: u.name.firstName,
    hobbies: u.array(u.enum("Fishing", "Swimming", "Reading"), { minValue: 1 })
  })

test("augmented user object composed correctly", async () => {
  const augmentedUser = await getAugmentedUser(42);
  assert.calledWith(myapi.spy, match({ method: "get", path: "users/42" }));
});

```

<!--code-->
```javascript
// augmentedUser.js
import axios from "axios";

export default async (id) => {
  const { data } = axios("https://myapi.com/users/"+id);
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false
  }
}
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `UnmockResponse`

Similarly, an object `UnmockResponse` can be used to verify API responses.

```javascript
{
  status: 200, // the status code, either as a number or string
  header: {}, // the header, represented as key-value pairs
  body: {}, // the body, a JSON object if it is a form or json, otherwise a string
}
```

All spies in Unmock provide the helper methods `getBody`, `getBodyOf`, `getBodies`, `getHeader`, `getHeaderOf`, `getHeaders` as explained [above](expectations#working-with-bodies). We recommend using these accessors instead of using the responses directly. That said, working with the response is useful when more complex verification schemes are necessary. Also, when possible, avoid writing "garbage-in-garbage-out" tests that simply verify your mock is passed throguh. When you do that, you are testing the Unmock library, which we of course appreciate, but that's our job :-)


<!--DOCUSAURUS_CODE_TABS-->

<!--test-->
```javascript
// augmentedUser.test.js
import unmock, { services: { myapi }, u } from "unmock";
import getAugmentedUser from "./getAugmentedUser";
import { assert, match } from "sinon";

unmock("https://myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.id,
    name: u.name.firstName,
    hobbies: u.array(u.enum("Fishing", "Swimming", "Reading"), { minValue: 1 })
  })

test("augmented user object composed correctly", async () => {
  const augmentedUser = await getAugmentedUser(42);
  // below is a garbage-in-garbage-out expectation using the statusCode
  // of the UnmockResponse object. while this may be useful for debugging,
  // it should be avoided when possible, as it tests your test but not
  // your code
  expect(200).toBe(myapi.spy.firstCall.returnValue.statusCode);
  // uses the "body" field of the UnmockResponse object
  expect(augmentedUser).toMatchObject(myapi.spy.firstCall.returnValue.body);
});

```

<!--code-->
```javascript
// augmentedUser.js
import axios from "axios";

export default async (id) => {
  const { data } = axios("https://myapi.com/users/"+id);
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false
  }
}
```

<!--END_DOCUSAURUS_CODE_TABS-->