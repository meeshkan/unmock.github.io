---
id: expectations
title: Service spies
sidebar_label: Service spies
---

In Unmock, every service has a `spy` property that is a [SinonJS spy](https://sinonjs.org/releases/v7.4.1/spies/). The spy keeps track of the requests made to the service and the (fake) responses returned by the service, allowing you to

1. **assert outgoing requests** were correct:

   ```js
   // Using SinonJS assertions
   assert.calledOnce(github.spy);
   const expectedRequest: UnmockRequest = { method: "get", path: "/v3/users", ... };
   assert.calledOnceWith(github.spy, expectedRequest);

   // Using unmock-expect
   expect(github).toBeCalledOnce();
   expect(github).toBeCalledOnceWith(expectedRequest);
   ```

1. **assert your code handled responses** correctly:
   ```js
   // Get the return value of the first call to GitHub
   const response: UnmockResponse = github.spy.firstCall.returnValue;
   expect(myCodeReturnValue).toEqual(response.body);
   ```

## Accessing the spy

If you're not familiar with the concept of test spies, here's the definition from [SinonJS documentation]():

> A test spy is a function that records arguments, return value, the value of this and exception thrown (if any) for all its calls.

As noted above, the request-response pairs faked by Unmock services are exposed through their `spy` property.

The `spy` property can be accessed through Unmock services as follows:

```js
const { github } = unmock.on(); // Activate unmock and load services
const githubSpy = github.spy;
```

Here, `github.spy` is a [SinonJS spy](https://sinonjs.org/releases/v7.4.1/spies/) with methods such as `callCount`, `firstCall`, `calledWith`.

## Spy calls

Every service spy keeps a list of

The arguments to function calls are `UnmockRequest` objects and the responses (contained within `spy.returnValue`) are `UnmockResponse` objects:

```js
import { UnmockResponse } from "unmock-node";

const githubApiResponse = githubSpy.returnValue;
```

## Resetting spy

Spies can be reset as follows:

```js
spy.resetHistory(); // Only reset a single spy
service.reset(); // Reset service along with its spy
unmock.reset(); // Reset all services along with their spies
```

These reset the spy history so that, for example, `spy.callCount` is zero.
