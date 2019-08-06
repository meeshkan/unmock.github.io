---
id: state:advanced
title: Advanced state management with DSL
sidebar_label: DSL
---

Setting the response body as described in the [previous section](state-basic.md) is often sufficient, but sometimes you need to more control to test, for example, the behaviour for status code 500 or start with 10 users in a service. This can be achieved with the unmock DSL. All DSL elements are prefixed with the dollar sign (`$`).

## Top-level DSL

Top-level DSL is not specific to any property in the response body and can therefore only be found at the top level of the object passed as a state. At any other level, it will be treated as a proper key. All of the commands below can apply to the top-level DSL or to a specific mocked service.

## `$code`

Using `$code`, you can specify the status code returned by the service for a call to a given endpoint. The response code must exist in the service specification.

```javascript
// Returns a 500 error on requests to `/pets/5`
states.petstore("/pets/5", { $code: 500 });
// Make sure a 200 response for `/pets/2` and set the name property
states.petstore("/pets/2", { $code: 200, name: "Ace" });
```

## `$times`

With `$times`, you can specify for how many requests the state is valid. Once a state has been used `$times` times, it will be removed and responses will be generated for all items.
`$times` is rounded to the nearest integer and must be greater than 0.

```javascript
// Returns "Ace" for the first two requests to pets/*.
// Then generate a random name as usual.
states.petstore("/pets/*", { $times: 2, name: "Ace" });
```

## `$size`

For array type objects, one can control how many items are returned with the `$size` DSL instruction. Unmock, as always, verifies the instruction is indeed matched for an array object, and that the value for `$size` makes sense (rounds to a positive number).

```javascript
// Return 4 pets. We can specify it at top level as the content returned is an array.
states.petstore("/pets", { $size: 4 });
// Generate 40 items for any request to api.github.com/search/repositories
states.github("/search/repositories", {
  total_count: 40,
  items: { $size: 40 },
});
```

## State middleware

Unmock currently offers two middleware functions. The default one is the object-notation middleware. You've seen it in the [basic usage](state-basic.md) - you pass key-value pairs as a state. The other one is a string middleware. Both are found under `unmock.middleware`.

We roll out more middlewares as are necessary - please [let us know](https://github.com/unmock/unmock-js/issues) if you're missing anything!

### Object-notation middleware

This is the default notation. It matches many content type requests - `application/json`, `application/xml`, `multipart/form-data`, etc. It is the default exported middleware in `unmock.middleware`, and it is automatically used if no middleware is specified.

It works by abstracting away certain elements that are present in the OpenAPI specification, but are abstracted away from the response. Thus, instead of using `{ items: { properties: { id: 5 } } }`, one may simply use `{ id: 5 }`.

### String middleware

Many other content types have a simple schema for a response. `text/plain`, `image/*`, `application/octet-stream` and many more have a `type: string` (and additional `format`) specified as their schema. To set a state for these responses, where we don't have a key, you may use the `textMW` (we're very creative!).

The text middleware accepts a string input, and optional object for top-level DSL.

```javascript
const textMW = unmock.middleware.textResponse;
states.petstore(textMW("foo"));
states.petstore("/pets/*", textResponse("bar", { $code: 200 }));
```
