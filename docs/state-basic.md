---
id: setting-state
title: Setting state
sidebar_label: Setting state
---

Once activated, Unmock will mock services according to their specifications. The default behavior is to serve _randomly generated valid responses_. While this means that your tests are not deterministic, tests like this help ensure the resiliency of your code. Testing your code with indeterministic responses helps you make a more robust code. It helps you **fail your way to success**, a way of coding we strongly believe in.

## Setting state for a service

Sometimes, you need to refine Unmock's default behavior on a test-by-test basis. To do this, you can use the _states_ object returned from `unmock.on()` or `unmock.states()`:

```javascript
const states = unmock.on();
// or
const states = unmock.states();
```

> Beware: `unmock.states()` will be undefined if you haven't called `unmock.on()`.

To modify the state for a service named `github`, you would then call methods on `states.github` as described below, allowing you to set specific response bodies for any HTTP method and path.

## Modifying response body

### JSON response

To modify response bodies for content type `application/json` for a service named `github`, you may:

- Call `states.github` with the state you would like to return:

  ```javascript
  // Sets the `repository` field _anywhere_ in the response body to "unmock-js"
  states.github({ repository: "unmock-js" });
  ```

  Unmock automatically finds out which endpoints and which HTTP methods this state change applies to and only applies the state change to those endpoints.

- Call `states.github` with the path for which you'd like to define a new state:

  ```javascript
  // Set the `name` field to "sparky" for the response to any HTTP operation at `/user`
  states.github("/user", { name: "sparky" });
  ```

  > Tip:
  > You can also use wildcards for single path item replacements:
  >
  > ```javascript
  > states.github("/users/*", { name: "lucy" });
  > ```

- Call `states.github` with a specific HTTP method within the service:

  ```javascript
  // Set the `name` field to "still sparky" for a GET request to `/user/sparky`
  states.github.get("/users/sparky", { name: "Still Sparky" });
  ```

### Text response

If the service returns content type of `text/plain` and you want to set a specific text response, you can replace the object inputs above with plain strings:

```javascript
// Sets the text response for any operation to any path to "Document not found"
states.petstore("Document not found");

// Sets the text response for any operation to `/path` to "Document not found"
states.petstore("/path", "Document not found");

// Sets the text response for `GET /path` to "Document not found"
states.petstore.get("/path", "Document not found");
```

## Modifying response code

To make the service return a specific status code such as 404, use the `$code` variable in the state input:

```javascript
// Sets the response code for any operation to any path to 404
states.petstore({ $code: 404 });

// Return `{ message: "Not found" }` and code 404
states.petstore({ message: "Not found", $code: 404 });

// Return text "Not found" and code 404
states.petstore({ $code: 404 }).petstore("Not Found");
```

You can use the same `states.petstore.get` and `states.petstore("/path")` constructs as above to set the state for specific operations and paths, respectively.

## Resetting the state

Reset a specific service state, or reset all the states:

```javascript
states.github.reset(); // Reset the state for `github`
states.reset(); // Reset the state for all services
```

## Fluent API

`states` object exposes a fluent API so you can chain multiple calls to set multiple states:

```javascript
states
  .github
    .get("/users/sparky", { name: "Still Sparky" })
    .get("/users/lilo", { name: "Lilo" })
  .github
    .post(...);
```

> Warning: You cannot chain new calls after `reset()` with the fluent API.

## Merged state

Once the states are set and a request is captured, it is matched against the service and the most specific state is being used to generate the response. For example, assume the following state is being set:

```javascript
states
  .petstore({ id: -999 })
  .petstore("/pets/*", { name: "Finn" })
  .petstore("/pets/1", { id: 1 });
```

The following calls will generate the matching responses:

```javascript
fetch(`${PETSTORE_URL}/pets/1`); // -> { id: 1, name: "Finn" }
fetch(`${PETSTORE_URL}/pets/3`); // -> { id: -999, name: "Finn" }
fetch(`${PETSTORE_URL}/pets/513`); // -> { id: -999, name: "Finn" }
fetch(`${PETSTORE_URL}/pets`);
// -> [{ id: -999, name: randomly generated }, { id: -999, name: generated }, ... ]
```

More advanced state management with the Unmock DSL is the topic of the [next section](state-advanced.md).
