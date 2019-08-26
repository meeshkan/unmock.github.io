---
id: expectations
title: Awesome Assertions
sidebar_label: Awesome Assertions
---

Now that you know how to define services in Unmock, it would be useful to assert things about how they are used. When services are defined in Unmock, they automagically reside in the `unmock.services` object.

```javascript
const unmock = require('unmock');
unmock("https://api.myapi.com/v2/foo").serve({ hello: "world" });
const myapi = unmock.services.myapi;
```

> For Typescript users, services will be typed according to their specifications. Depending on how you define services, the type of the `unmock.services` object will sometimes fall out of sync with your service specifications. If/when this happens, run `unmock ts` from the CLI. It is a good idea to make `unmock ts` part of any compilation or build process.

These service objects contain lots of useful properties for you to write simple and effective tests with great expectations!

## Using `unmock-expect`

`unmock-expect` is the recommended, idiomatic way to create assertions about services' behavior.

```js
expect(github).calledOnce();
expect(github).calledOnceWith(expectedRequest);
expect(github).calledOnceWithMatch({ path: "/v3/users" });
```

*Some stuff about `unmock-expect`*

## Advanced expectations

In Unmock, every service has a [**spy**](https://en.wikipedia.org/wiki/Spy_vs._Spy) property that keeps track of the requests made to each service and the associated fake responses. Before using a spy, you should try to write tests that use `unmock-expect` as defined above. The nice thing about `unmock-expect` is that it enforces an opinionated but reasonable standard of what *should* be tested. However, sometimes these expectations don't cut it for your use case, in which case you should use spies.

Spies are covered in the [Advanced](spies.md) section of this documentation.