---
id: basic
title: Basic concepts
sidebar_label: Basic concepts
---

Once Unmock is activated, it will mock APIs according to the specifications in your `__unmock__` directory.

## Flaky mode

Unmock's default behavior, which we affectionally call "flaky mode", serves random valid responses from your mock APIs. While this means that your tests are not deterministic, tests like this help ensure the resiliency of your code. Unmock keeps track of all the responses it generates so that, if your test ever fails because a random response exposes a corner case, you can use that response to write a new test.

Testing your code with indeterministic responses helps you make a more robust code. It helps you **fail your way to success**, a way of coding we strongly believe in.

## Setting a state

Sometimes, you would like to refine Unmock's default behavior on a test-by-test basis. To do this, you can manipulate the unmock _state store_ object. When calling `unmock.on()` (or equivalent), you will get a state store as a returned value.

```javascript
var states = unmock.on();
```

The state store is a fluent API that allows you to set specific responses/content for any HTTP method and endpoint combination. Every call to states is either a name of a service (taken from the service subfolder name), an HTTP method, or a call to `reset()`.

## A typical flow

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

  ::: tip
  Unmock also accepts wildcards for single path item replacements!

  ```javascript
  states.petstore("/pets/*", { name: "lucy" });
  ```

  :::

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
  ::: warning
  A call to `reset()` terminates the fluency of the state store.
  :::

Once the states are set and a request is captured, it is then matched against the service and the most specific state is being used to generate the response. For example, assume the following state is being set:

```javascript
states
  .petstore({ id: -999 })
  .petstore("/pets/*", { name: "Finn" })
  .petstore("/pets/1", { id: 1 });
```

The following calls will generate the matching responses:

```javascript
axios(`${PETSTORE_URL}/pets/1`); // -> { id: 1, name: "Finn" }
axios(`${PETSTORE_URL}/pets/3`); // -> { id: -999, name: "Finn" }
axios(`${PETSTORE_URL}/pets/513`); // -> { id: -999, name: "Finn" }
axios(`${PETSTORE_URL}/pets`);
// -> [{ id: -999, name: randomly generated }, { id: -999, name: generated }, ... ]
```
