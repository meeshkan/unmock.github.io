---
id: expectations
title: Expectations
sidebar_label: Expectations
---

When testing code using an external service, you typically want to verify two things:

1. **Outgoing requests are correct**
1. **Incoming responses are handled correctly**

You do not want to verify, for example, that the service returned 200, because your code is not responsible for creating the responses.

<!--
This separates the concerns of creating requests and handling responses from actually sending those requests and getting the response.
-->

To help verify your code made correct calls and handled responses correctly, Unmock exposes `spy` objects. If you're not familiar with the concept of test spies, here's the definition from [SinonJS documentation]():

> A test spy is a function that records arguments, return value, the value of this and exception thrown (if any) for all its calls.

In Unmock, a service is responsible for faking the real service. The request-response pairs faked by the service are exposed through the `spy` property.

## Service spies

The `spy` property can be accessed through Unmock services as follows:

```js
const { github } = unmock.on(); // Activate unmock and load services
const githubSpy = github.spy;
```

Here, `github.spy` is a [SinonJS spy](https://sinonjs.org/releases/v7.4.1/spies/) with methods such as `callCount`, `firstCall`, `calledWith`. The arguments to function calls are `Request` objects and the responses are `Response` objects:

```js
const
```
