---
id: setting-state
title: Initializing Mocks
sidebar_label: Initializing Mocks
---

Once activated, Unmock will mock services according to their specifications. The default behavior is to serve _randomly generated valid responses_. For example, the snippet below will generate **either** `200` **or** `404`.

```javascript
import unmock, { u } from "unmock";

unmock
  .nock('https://api.myapi.com')
  .get('/user/{id}')
  .reply(200, {
    id: u.number(),
    name: u.string("name.firstName")
  })
  .get('/user/{id}')
  .reply(404, {
    message: "Naughty you!"
  })
```

That's all well and good, but sometimes, you'd like for a service to behave more specifically, like **only** responding with a given code or **only** responding with an array of size ten.  You can do this in one of two ways: calling `service.reset()` and redefining the service *or* using `service.state`.

In most cases, resetting and redefining the service is all you need. However, when you are working with OpenAPI, or when you have a complex service defined, using the `state` can be a simple and elegant solution.

## Setting state for a service

Let's revisit the example above, and use the state to make sure we are only returning `200`.

```javascript
import unmock, { u, transform } from "unmock";
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
```

The example above shows two important concepts when working with a state.

1. The service should have a name, which is created via the second argument to `unmock.nock`.
1. The code is set to `200` by passing `withCodes(200)` to `myapi.state`.

## Modifying the response body

One common need is to modify the response body.  We'll tweak the example from above to show how we can set any part of a response body.

```javascript
import unmock, { u, transform } from "unmock";
const { withCodes } = transform;

unmock
  .nock('https://api.myapi.com', 'myapi')
  .get('/user/{id}')
  .reply(200, {
    id: u.number(),
    name: u.string("name.firstName"),
    zodiac: {
      sign: u.string(),
      ascendant: u.string(),
      aspect: u.string(),
      transit: u.string()
    }
  })
  .get('/user/{id}')
  .reply(404, {
    message: "Naughty you!"
  })

const { myapi } = unmock.on().services;
myapi.state(
  withCodes(200),
  responseBody({ lens: ["name"]}).const("Carolyn"),
  responseBody({ lens: ["zodiac", "ascendenet"]}).const("Libra")
);
```

We've overridden the body so that the value at `body.name` is `"Carolyn"` and `body.zodiac.ascendenet` is `"Libra"`. `lens` acts as a lens that zooms in on part of an object, not unlike the concept of lenses [optics](https://en.wikibooks.org/wiki/Haskell/Lenses_and_functional_references) from functional programming.

One gotchya is how to zoom in on objects with variable numbers of propreties. To zoom in on an index of an array, just use the number. To zoom in on every element of the array, use the `unmock.Arr` symbol in the lens, ie `[Arr, "id"]` to set the `id` of every element in a top-level array. To zoom in on every element of a Record (an object with key-value pairs) use `Addl`, ie `[Addl, "id"]` to set the `id` of every element in a record.

In your IDE, you can inspect the signature of `responseBody` to see the various parts of a body you can set. You can make a property required, set the minimum number of items in an array, and lots more!

## Resetting the state

To reset a specific service state or a whole service (including spies), you can use `reset()`.

```javascript
github.state.reset(); // Reset the state for `github`
github.reset(); // Reset the service, including state
```

