---
id: spies
title: Spies
sidebar_label: Spies
---

In Unmock, a spy is nothing but a wrapper for **request-response pairs, augmented with the rich [SinonJS API](https://sinonjs.org/releases/v7.4.1/spies/)** containing properties such as `callCount`, `getCalls`, `firstCall`, `calledOnce`, etc. To read more about test spies, see the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/).

Spies are accessed via the service as follows:

```js
const {
  services: { github },
} = unmock.on(); // Activate unmock and load services
const githubSpy = github.spy;
```

An unmock spy has the properties documented in the [SinonJS documentation](https://sinonjs.org/releases/v7.4.1/spies/):

```js
const wasCalled = githubSpy.calledOnce; // true or false
const callCount = githubSpy.callCount; // Number of calls
const firstCallArgs = githubSpy.args[0]; // Arguments of the first call.
```

While it is possible use boolean properties such as `githubSpy.calledOnce` for assertions, we recommend using either the SinonJS `assert` or `unmock-expect` as explained below for better error messages.

### Using SinonJS assert

To use SinonJS asserts, import `sinon` from `unmock-node`:

```js
import { sinon } from "unmock-node";
const assert = sinon.assert;
```

The full documentation for SinonJS assertions can be found [here](https://sinonjs.org/releases/v7.4.1/assertions/). Here are some examples:

1. Verify GitHub API was called twice:

   ```js
   assert.calledTwice(githubSpy);
   ```

1. Verify GitHub was called once with the exact expected request:

   ```js
   const expectedRequest = {
     method: "get",
     path: "/v3/users",
     protocol: "https",
     body: undefined,
   }; // UnmockRequest object

   assert.calledOnceWith(githubSpy, expectedRequest);
   ```

1. Verify `github` was called with a request that matches the given properties:

   ```js
   const match = sinon.match;

   const expectedRequest = {
     method: "get",
     path: "/v3/users",
   }; // Partial UnmockRequest object

   // Only match method and path
   assert.calledWith(githubSpy, match(expectedRequest));
   ```

## Verifying individual calls

### Spy calls 101

As noted above, a service spy is essentially a wrapper around a list of request-response pairs. Each member of the list is a **spy call**, representing a single call to a service. Accessing individual calls helps with more detailed behavior verification when the spy is called more than once and also lets you access the response returned by an Unmock service.

You can access individual calls via the [spy API](https://sinonjs.org/releases/v7.4.1/spies/) as follows:

```js
const firstCall = githubSpy.firstCall; // First call
const lastCall = githubSpy.lastCall; // Last call
const sixthCall = githubSpy.getCall(6); // Sixth call
```

A single spy call consists of the arguments of the call and the associated return value. Arguments are accessed via `args` property. It is a list of length one with `UnmockRequest` object as the only value:

```js
// Access the request of the first call
const firstCallRequest = firstCall.args[0]; // UnmockRequest object
const firstCallRequestAlt = firstCall.lastArg; // Same as above, list has one value
const firstCallRequestMethod = firstCallRequest.method; // "get", "post", "put", etc.
```

The return value in a spy call is an `UnmockResponse` object and it is accessed via the `returnValue` property:

```js
// Access the response of the first call
const firstCallResponse = firstCall.returnValue; // UnmockResponse object
const firstCallResponseStatus = firstCallResponse.statusCode; // Status code
```

The full spy call API is documented [here](https://sinonjs.org/releases/v7.4.1/spy-call/). For example, this checks if the call matched the expected properties:

```js
const calledCorrectly = firstCall.calledWith(match(expectedUnmockRequest)); // true or false
```

Similarly as for spies, it is not recommended to boolean properties for assertions but use `assert` or `unmock-expect` as explained below.

### Using SinonJS assert

First import SinonJS `assert`:

```js
import { sinon } from "unmock-node";
const assert = sinon.assert;
```

Here are some examples of asserts on single calls:

1. Verify call was made with the exact `UnmockRequest` expected:

   ```js
   // Full UnmockRequest object
   const expectedRequest = { method: "get", path: "/v3/users", ... };
   assert.calledWith(spyCall, expectedRequest);
   ```

1. Verify call matches the given properties:

   ```js
   const match = sinon.match;
   assert.calledWith(spyCall, match({ method: "get", path: "/v3" }));
   ```

## Resetting spy

Spy history can be reset as follows:

```js
service.spy.resetHistory(); // Reset a single spy, leave everything else intact
service.reset(); // Reset service, including its spy
```

Resetting the spy history empties the list of calls so that `spy.getCalls` is an empty list.