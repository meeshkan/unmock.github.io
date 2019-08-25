---
id: setting-state-dsl
title: State management
sidebar_label: State management
---

Modifying the response body or status code as described in the [previous section](states.md) is often sufficient, but sometimes you need more control to test, for example, the behaviour for a service with 10 users. This can be achieved with the Unmock DSL. All DSL elements are prefixed with the dollar sign (`$`).

## Top-level DSL

Top-level DSL is not specific to any property in the response body and can therefore only be found at the top level of the object passed as a state. At any other level, it will be treated as a proper key. All of the commands below can apply to the top-level DSL or to a specific mocked service.

## `$code`

The DSL element `$code` was introduced in the [previous section]("./state-basic.md") for specifying the status code returned by the service for a call to a given endpoint. Note that the response code must exist in the service specification.

```javascript
// Returns a 500 error on requests to `/pets/5`
petstore.state("/pets/5", { $code: 500 });
// Make sure a 200 response for `/pets/2` and set the name property
petstore.state("/pets/2", { $code: 200, name: "Ace" });
```

## `$times`

With `$times`, you can specify for how many requests the state is valid. Once a state has been used `$times` times, it will be removed and responses will be generated for all items.
`$times` is rounded to the nearest integer and must be greater than 0.

```javascript
// Returns "Ace" for the first two requests to pets/*.
// Then generate a random name as usual.
petstore.state("/pets/*", { $times: 2, name: "Ace" });
```

## `$size`

For array type objects, one can control how many items are returned with the `$size` DSL instruction. Unmock, as always, verifies the instruction is indeed matched for an array object, and that the value for `$size` makes sense (rounds to a positive number).

```javascript
// Return 4 pets. We can specify it at top level as the content returned is an array.
petstore.state("/pets", { $size: 4 });
// Generate 40 items for any request to api.github.com/search/repositories
github.state("/search/repositories", {
  total_count: 40,
  items: { $size: 40 },
});
```

## State DSL middleware

Unmock currently offers two middleware functions. The default one is the object-notation middleware. You've seen it in the [basic usage](state-basic.md) - you pass key-value pairs as a state. The other one is a string middleware. Both are found under `unmock.middleware`.

We roll out more middlewares as are necessary - please [let us know](https://github.com/unmock/unmock-js/issues) if you're missing anything!

### Object-notation middleware

This is the default notation. It matches many content type requests - `application/json`, `application/xml`, `multipart/form-data`, etc. It is the default exported middleware in `unmock.dsl`, and it is automatically used if no middleware is specified.

It works by abstracting away certain elements that are present in the OpenAPI specification, but are abstracted away from the response. Thus, instead of using `{ items: { properties: { id: 5 } } }`, one may simply use `{ id: 5 }`.

### String middleware

Many other content types have a simple schema for a response. `text/plain`, `image/*`, `application/octet-stream` and many more have a `type: string` (and additional `format`) specified as their schema. To set a state for these responses, where we don't have a key, you may use the `textResponse` (we're very creative!).

The text middleware accepts a string input, and optional object for top-level DSL.

```javascript
// import { dsl: textResponse } from "unmock-node";  // ES6
const { dsl: textResponse } = require();
petstore.state(textResponse("foo")); // Same as `states.petstore("foo")
petstore.state("/pets/*", textResponse("bar", { $code: 200 })); // Same as `states.petstore("/pets/*", { $code: 200 }).petstore("/pets/*", "bar");
```
