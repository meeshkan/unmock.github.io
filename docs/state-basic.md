---
id: state:basic
title: Setting state
sidebar_label: Setting state
---

Once activated, Unmock will mock services according to their specifications. The default behavior is to serve _randomly generated valid responses_. While this means that your tests are not deterministic, tests like this help ensure the resiliency of your code. Testing your code with indeterministic responses helps you make a more robust code. It helps you **fail your way to success**, a way of coding we strongly believe in.

## Accessing state

Sometimes, you need to refine Unmock's default behavior on a test-by-test basis. To do this, you can manipulate the _states_ object returned from `unmock.on()`:

```javascript
const states = unmock.on();
```

The `states` object exposes a fluent API that allows you to set specific response bodies for any HTTP method and path combination.

> You can also access the `states` object via `unmock.states()`, but beware: the object will be undefined if you haven't called `unmock.on()`.

## Working examples

To set a state for a service, you may:

- Call the service with the state you would like to return.

  ```javascript
  states.hello({ hello: "world" });
  ```

  Unmock will automatically find which endpoints and which HTTP methods this state applies to, and would set that as their state.

- Call the service with the endpoint you would like to set, and the state you would like to set for it.

  ```javascript
  states.petstore("/pets/5", { name: "sparky" });
  ```

  > Tip:
  > You can also use wildcards for single path item replacements:
  >
  > ```javascript
  > states.petstore("/pets/*", { name: "lucy" });
  > ```

- Access a specific HTTP method within the service and use the same calls on it

  ```javascript
  states.petstore.get("/pets/5", { name: "still sparky" });
  ```

- Chain multiple calls with either HTTP methods and/or services:
  ```javascript
  states
    .petstore
      .get("/pets/*", { name: "generic" })
      .get("/pets/5", { name: "you guessed it! It's sparky!", id: 5 })
    .github
      .post(...);
  ```
- Reset a specific service state, or reset all the states:

  ```javascript
  states.petstore.reset();
  states.reset();
  ```

  > Warning: You cannot chain new calls after `reset()`.

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

More advanced state management with the Unmock DSL is the topic of the [next section](advanced.md).
