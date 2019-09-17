---
id: unmock
title: Defining Services
sidebar_label: Defining Services
---

Unmock provides a programmatic and interactive way of building services across multiple test files. A **service** in Unmock is any REST API that is being mocked - a microservice, [openweathermap.org](https://openweathermap.org/api), etc.

The service-definition syntax is a subset [`nock`](https://github.com/nock/nock) and lives under the object `unmock.nock`.  Here is a simple example of a GET request in unmock.

```javascript
// mytest.js
import unmock, { u } from "unmock";

unmock
  .nock("https://www.myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u.integer(), // a random integer
    name: u.string("name.firstName"), // generates a fake name
    age: u.number(), // generates a fake age
    type: 'user', // the literal word "user"
  });
```

## Poet

The Unmock `u` object uses the same syntax as [`json-schema-poet`](https://github.com/unmock/json-schema-poet) to represent indeterminate fields in a response header or body.  For example, `u.number` generates a random number, `u.stringEnum` generates a random string choosing from an array of string values, etc. To see the full list of options, check out the [`json-schema-poet`](https://github.com/unmock/json-schema-poet) README.

## Verbs

Like in `nock`, unmock supports all standard HTTP(S) verbs.

### GET requests

GET requests can be built like this.

```javascript
import unmock, { u } from "unmock";

unmock
  .nock('https://api.myapi.com')
  .get('/user/{id}')
  .reply(200, {
    id: u.number(),
    name: u.string("name.firstName")
  })
```

### POST requests

POST requests can be defined similar to GET requests, with an optional body as a second argument to `post`.

```javascript
import unmock, { u } from "unmock";

unmock
  .nock('https://api.myapi.com')
  .post('/user/{id}', {
    name: u.name.firstName,
  })
  .reply(200, {
    id: u.number(),
    name: u.string("name.firstName")
  })
```

### Other verbs

In addition to GET and POST, Unmock supports PUT, DELETE, PATCH, OPTIONS, and HEAD.

```javascript
unmock
  .nock('https://api.myapi.com')
  .delete('/user/{id}')
  .reply(200);
```

## Headers

Unmock allows you to specify request headers as a second argument to the `unmock` function.

```javascript
import unmock, { u } from "unmock";

unmock
  .nock('https://api.myapi.com', reqheaders: {
    ["X-Unmock-Is"]: u.stringEnum(["Awesome", "Truly Awesome"])
  })
  .get('/user/{id}')
  .reply(200, {
    id: u.number()
  });
```

Response headers can be specified as a third argument to the `reply` function.

```javascript
unmock
  .nock('https://api.myapi.com')
  .get('/user/{id}')
  .reply(200, {
    id: u.number()
  }, {
    ["X-LastSeen"]: u.string("date.past")
  });
```

## Fluid API

Services definitions can be chained in a fluid API *or* in separate calls to `unmock.nock`.

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