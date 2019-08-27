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

An unmock spy has all the properties documented in the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/). In addition to this, it has some useful functions that make working with HTTP(S) related concepts, like request headers or response bodies, easy.

## Paths and Headers and Bodies, Oh My!

When working with network calls, we will often want to make assertions like the right path was called, the right header was used or the right body was returned. Unmock spies have some useful functions for this that follow a simple convention.

> `<method><OneOrMany>(/* matcher */)`

- **method** is one of get `post`, `put`, `delete`, `patch`, `head`, `options`.
- **OneOrMany** is one of `protocol`, `host`, `method`, `path`, `query`, `requestHeader`, `requestBody`,`statusCode`, `responseHeader`, `responseBody`. When you are retrieving multiple results, use the plural: `protocols`, `hosts`, `methods`, `queries`, etc...
- **matcher**, which is optional, is an object against which the value should match *or* a [SinonJS matcher](https://sinonjs.org/releases/v7.4.1/matchers/). For example, if you use `getPaths`, you may want to only match against paths in the form `user/{id}` - this would be the string you pass to `getPaths`.

We've already seen `getPath` and `getResponseBody` in the initial [simple example](introduction.md). Below is a simple test that uses `postRequestBody` to work with the body of a response to a post request.

<!--DOCUSAURUS_CODE_TABS-->

<!--test-->
```javascript
// augmentedUser.test.js
import unmock, { services: { myapi }, u } from "unmock";
import postAugmentedUser from "./postAugmentedUser";
import sinon from "sinon";

const hobbies = u.enum("Fishing", "Swimming", "Reading")
unmock("https://myapi.com")
  .post("/users/{id}", { name: u.$.name.firstName, hobby: hobbies })
  .reply(200, {
    id: u._.id,
    name: u.name.firstName,
    hobbies: u.array(hobbies, { minValue: 1 })
  })

test("augmented user object composed correctly", async () => {
  const augmentedUser = await postAugmentedUser(42, "Jane", "Fishing");
  expect(augmentedUser).toMatchObject(myapi.spy.postRequestBody());
});

test("augmented user does not have race conditions", async () => {
  const augmentedUsers =
    Promise.all([[42, "Jane", "Fishing"], [43, "Bob", "Reading"]]
      .map(i => postAugmentedUser.apply(null, i)));
  expect(augmentedUsers[0]).toMatchObject(myapi.spy.postRequestBody(sinon.match({id: 42})));
  expect(augmentedUsers[1]).toMatchObject(myapi.spy.postRequestBody(sinon.match({id: 43})));
});
```

<!--code-->
```javascript
// augmentedUser.js
import axios from "axios";

export default async (id, name, hobby) => {
  const { data } = axios.post("https://myapi.com/users/"+id, { name, hobby });
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false
  }
} 
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Using SinonJS assert

When possible, you should use functions like `postProtocol` or `putPath` above to reason about HTTP(S) calls. They make your test easy to read and maintain. However, sometimes, you may need to make more fine grained assertions having to do with the order of network calls or other subtleties. In this case, you'll want to use [SinonJS assertions](https://sinonjs.org/releases/v7.4.1/assertions/).

To use SinonJS assertions, import `sinon` from `unmock-node` or from `sinon` directly:

```javascript
import { sinon: { assert } } from "unmock-node";
// or import { assert } from "sinon";
```


The most important thing you'll need to know when working with Sinon assertions is how HTTP(S) requests and responses are represented at a lower level.  To make assertions about things in HTTP-land like queries or headers, you need to use `UnmockRequest` and `UnmockResponse` objects.

### `UnmockRequest`

An `UnmockRequest` is an object with the following fields, all of which are optional. When used with `sinon`, the fields can be [Sinon matchers](https://sinonjs.org/releases/v7.4.1/matchers/), or the whole object can be enclosed in a matcher.

```javascript
{
  protocol: "", // the protocol, either http or https
  host: "", // the host, like foo.com or bar.org
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

We've avoided being too preachy in this documentation, but it's important to make one small suggestion at this point.  When possible, avoid writing tests that test Unmock more than your own code. Often times, the barrier is subtle, but in the case below, the assertion about the status code can be removed - it makes the test longer, and only tells us that Unmock is working.


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