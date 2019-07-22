---
id: advanced
title: State DSL
sidebar_label: State DSL
---

Of course, setting a state (or not) is perfect, but sometimes we need to run tests for specific use cases. We might want to test our code when we hit a 500 error from a 3rd party API, or start with 10 users in our Unmocked project. We might want to set a state with a string, or binary, etc.

We use the term _DSL_ freely, but all it really means is setting some meta-level state. All DSL elements are prefixed with the dollar sign (`$`). We expand this DSL as needed, and currently offer minimal interaction.

## Top-level DSL

Top level DSL is DSL that is truly meta for the entire response. It's not specific to any property within the response. Therefore, it may only be found at the top level of the object passed as a state. At any other level, it will be treated as a proper key. All of the commands below can apply to the top-level DSL or to a specific mocked service.

## `$code`

Using `$code`, you may specify the response code you want for a specific endpoint. The response code must exist in the service specification.

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

For array type objects, one can control how many items are returned with the `$size` DSL instruction. Unmock, as always, verifies the instruction is indeed matched for an array object, and that the value for `$size` is logical (rounds to a positive number).

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

Unmock currently offers two middleware functions. The default one is the object-notation middleware. You've seen it in the (basic usage)[/basic] - you pass key-value pairs as a state. The other one is a string middleware. Both are found under `unmock.middleware`.

We roll out more middlewares as are necessary - please [let us know](https://github.com/unmock/unmock-js/issues) if you're missing anything!

### Object-notation middleware

This is the default notation. It matches many content type requests - `application/json`, `application/xml`, `multipart/form-data`, etc. It is the default exported middleware in `unmock.middleware`, and it is automatically used if no middleware is specified.

It works by abstracting away certain elements that are present in the OpenAPI specification, but are abstracted away from the response. Thus, instead of using `{ items: { properties: { id: 5 } } }`, one may simply use `{ id: 5 }`.

### String middleware

Many other content types have a simple schema for a response. `text/plain`, `image/*`, `application/octet-stream` and many more have a `type: string` (and additional `format`) specified as their schema. To set a state for these responses, where we don't have a key, you may use the `textMW` (we're very creative!).

The text middleware accepts a string input, and optional object for top-level DSL.

```javascript
var textMW = unmock.middleware.textMW;
states.petstore(textMW("foo"));
states.petstore("/pets/*", textMW("bar", { $code: 200 }));
```
