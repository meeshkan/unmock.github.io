---
id: expectations
title: Great Expectations
sidebar_label: Great Expectations
---

Now that you know how to define services in Unmock, it would be useful to assert things about how they are used. When services are defined and loaded in Unmock, they automagically reside in the `unmock.services` object. These service objects contain lots of useful properties for you to write simple and effective tests.

## Spying

Unmock uses **[Sinon JS Spies](https://sinonjs.org/releases/v7.4.1/spies/)** to give you access to the number of times an API is called, its return value, and other bits of useful information. You can check out the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/) for more information on the types of assertions that can be made with spies. The section below acts as a cookbook for writing great tests with spies.

Spies are properties of services. So, for example, to get the spy for GitHub, you would call:

```javascript
const {
  services: { github },
} = unmock.on(); // Activate unmock and load services
const githubSpy = github.spy;
```

An unmock spy has all the properties documented in the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/). In addition to this, it has some useful functions that make working with HTTP(S) related concepts, like request or response bodies, easy.

## Paths and Headers and Bodies, Oh My!

When working with network calls, we will often want to make assertions like the right path was called, the right header was used or the right body was returned. Unmock spies have some useful functions for this that follow a simple convention.

> `<method><Op>(/* matcher */)`

- **method** is one of `get`, `post`, `put`, and `delete`.
- **Op** is one of `requestHost`, `requestBody`, and `responseBody`.
- **matcher**, which is optional, is a [SinonJS matcher](https://sinonjs.org/releases/v7.4.1/matchers/). For example, if you use `getPaths`, you may want to only match against paths in the form `user/{id}` - you would pass `sinon.match({ path: sinon.match("user/") })` to `getPaths`. The arguments passed to `sinon.match` should be properties of the [UnmockRequest](#unmockrequest) object. If you're not using `sinon` in your project, you can import it from `unmock`:

  ```javascript
  import { sinon } from "unmock";
  ```

Below is a simple test using `expect` together with `postRequestBody` and `postResponseBody` to verify the request body of a post request as well as the code output.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->

```javascript
// augmentedUser.test.js
import unmock from "unmock";
import postAugmentedUser from "./postAugmentedUser";

let myapi;

beforeAll(() => {
  myapi = unmock.on().services.myapi;
});

test("augmented user object composed correctly", async () => {
  const augmentedUser = await postAugmentedUser(42, "Jane", "Fishing");
  const requestBody = myapi.spy.postRequestBody();
  // Verify request
  expect(requestBody).toBe({
    name: "Jane",
    hobby: "Fishing",
  });
  // Access response body
  const responseBody = myapi.spy.postResponseBody();
  // Verify output has all properties of `responseBody`
  expect(augmentedUser).toMatchObject(responseBody);
  expect(augmentedUser).toHaveProperty("seenInSession", false);
});
```

<!--Code-->

```javascript
// augmentedUser.js
import axios from "axios";

export default async (id, name, hobby) => {
  const { data } = axios.post("https://myapi.com/users/" + id, { name, hobby });
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false,
  };
};
```

<!--Service spec-->

```yaml
# __unmock__/myapi/openapi.yaml
openapi: 3.0.0
info:
  version: "1.0"
  title: "myapi"

paths:
  /users/{id}:
    parameters:
      - name: id
        in: path
        description: User ID
        required: true
        schema:
          type: integer
          format: int32
    post:
      responses:
        "200":
          description: "User"
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                  - hobbies
                properties:
                  id:
                    type: number
                  name:
                    type: string
                  hobbies:
                    type: array
                    items:
                      type: string
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Advanced usage

When possible, you should use functions like `postRequestBody` or `postRequestHost` above to reason about HTTP(S) calls. They make your test easy to read and maintain. However, sometimes, you may need to make more fine grained assertions having to do with the order of network calls or other subtleties. In this case, you'll want to use the full power of SinonJS spies.

Below is a test that uses only SinonJS spy properties such as `callCount` and `firstCall` to inspect [spy calls](https://sinonjs.org/releases/v7.4.1/spy-call/) and their return values (`firstCall.returnValue.body`).

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->

```javascript
// augmentedUser.test.js
import unmock from "unmock";
import postAugmentedUser from "./postAugmentedUser";

test("augmented user object composed correctly", async () => {
  const augmentedUser = await postAugmentedUser(42, "Jane", "Fishing");
  expect(myapi.spy.callCount).toBe(1);
  const firstCall = myapi.spy.firstCall;
  // Verify request
  expect(firstCall.args[0].body).toBe({
    name: "Jane",
    hobby: "Fishing",
  });
  // Verify code's return value
  expect(augmentedUser).toMatchObject(firstCall.returnValue.body);
});

test("augmented user does not have race conditions", async () => {
  const augmentedUsers = await Promise.all(
    [[42, "Jane", "Fishing"], [43, "Bob", "Reading"]].map(i =>
      postAugmentedUser.apply(null, i)
    )
  );
  expect(myapi.spy.callCount).toBe(2);
  expect(augmentedUsers[0]).toMatchObject(myapi.spy.firstCall.returnValue.body);
  expect(augmentedUsers[1]).toMatchObject(
    myapi.spy.secondCall.returnValue.body
  );
});
```

<!--Code-->

```javascript
// augmentedUser.js
import axios from "axios";

export default async (id, name, hobby) => {
  const { data } = axios.post("https://myapi.com/users/" + id, { name, hobby });
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false,
  };
};
```

<!--Service spec-->

```yaml
# __unmock__/myapi/openapi.yaml
openapi: 3.0.0
info:
  version: "1.0"
  title: "myapi"

paths:
  /users/{id}:
    parameters:
      - name: id
        in: path
        description: User ID
        required: true
        schema:
          type: integer
          format: int32
    post:
      responses:
        "200":
          description: "User"
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                  - hobbies
                properties:
                  id:
                    type: number
                  name:
                    type: string
                  hobbies:
                    type: array
                    items:
                      type: string
```

<!--END_DOCUSAURUS_CODE_TABS-->

The argument in `spyCall.args[0]` is an `UnmockRequest` object and the `returnValue` is an `UnmockResponse` object as [defined below](#unmockrequest).

Because Unmock service spies are Sinon JS spy objects, you can also use [SinonJS assert](https://sinonjs.org/releases/v7.4.1/assertions/) for more expressive assertions such as `calledOnce`:

```javascript
import { assert, match } from "sinon";
assert.calledOnce(github.spy);
assert.calledOnceWith(github.spy, match({ method: "get" }));
```

If you're not using `sinon` in your project, you can import `sinon` from `unmock`:

```javascript
import { sinon } from "unmock";
```

## Requests and responses

The most important thing you'll need to know when working with Unmock assertions is how HTTP(S) requests and responses are represented at a lower level. To make assertions about things in HTTP-land like queries or headers, you need to use `UnmockRequest` and `UnmockResponse` objects.

### `UnmockRequest`

An `UnmockRequest` is an object with the following fields, all of which are optional. When used with `sinon`, the fields can be [Sinon matchers](https://sinonjs.org/releases/v7.4.1/matchers/), or the whole object can be enclosed in a matcher.

```javascript
{
  protocol: "", // the protocol, either http or https
  host: "", // the host, like foo.com or bar.org
  method: "", // the HTTP method (get, post, etc.)
  path: "", // the full path that was called, including query parameters
  pathname: "", // the path that was called without query parameters
  headers: {}, // the headers, represented as key-value pairs
  body: {}, // the body, a JSON object if it is a form or json, otherwise a string
  query: {}  // query parameters as key-value pairs
}
```

Here is how an Unmock request can be used in a test.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->

```javascript
// createUser.test.js
import unmock from "unmock";
import createUser from "./createUser";
import { assert, match } from "sinon";

const { myapi } = unmock.on().services;

test("augmented user object composed correctly", async () => {
  await createUser({ name: "Jane", isAdmin: true });
  await createUser({ name: "Bob", isAdmin: false });
  // Access the first request body with a matcher
  const firstRequestBody = myapi.spy.postRequestBody(
    match({ body: match({ name: "Jane" }) })
  );
  // Assert "type" field was set to "admin"
  expect(firstRequestBody).toMatchObject({ type: "admin" });
  // Access the second request body with a matcher
  const secondRequestBody = myapi.spy.postRequestBody(
    match({ body: match({ name: "Bob" }) })
  );
  // Assert "type" field was set to "user"
  expect(secondtRequestBody).toMatchObject({ type: "user" });
});
```

<!--Code-->

```javascript
// createUser.js
import axios from "axios";

export default async ({ name, isAdmin }) => {
  const { data } = axios.post("https://myapi.com/users/", {
    name,
    type: isAdmin ? "user" : "admin",
  });
  return data;
};
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `UnmockResponse`

Similarly, an object `UnmockResponse` can be used to verify API responses.

```javascript
{
  status: 200, // the status code as a number
  headers: {}, // the headers, represented as key-value pairs
  body: {}, // the body, a JSON object if it is a form or json, otherwise a string
}
```

We've avoided being too preachy in this documentation, but it's important to make one small suggestion at this point. When possible, avoid writing tests that test Unmock more than your own code. Often times, the barrier is subtle, but in the case below, the assertion about the status code can be removed - it makes the test longer, and only tells us that Unmock is working.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->

```javascript
// augmentedUser.test.js
import unmock from "unmock";
import getAugmentedUser from "./getAugmentedUser";
import { assert, match } from "sinon";

const { myapi } = unmock.on().services;

test("augmented user object composed correctly", async () => {
  const augmentedUser = await getAugmentedUser(42);
  // below is a garbage-in-garbage-out expectation using the statusCode
  // of the UnmockResponse object. while this may be useful for debugging,
  // it should be avoided when possible, as it tests your test but not
  // your code
  expect(200).toBe(myapi.spy.firstCall.returnValue.statusCode);
  // uses the "body" field of the UnmockResponse object
  expect(augmentedUser).toMatchObject(myapi.spy.getResponseBody());
});
```

<!--Code-->

```javascript
// augmentedUser.js
import axios from "axios";

export default async id => {
  const { data } = axios("https://myapi.com/users/" + id);
  return {
    ...data,
    fetchedOn: new Date(),
    seenInSession: false,
  };
};
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Resetting spy

Spy history can be reset as follows:

```js
service.spy.resetHistory(); // Reset a single spy, leave everything else intact
service.reset(); // Reset service, including its spy
```

Resetting the spy history empties the list of calls so that `spy.getCalls` is an empty list.

