---
id: unmock
title: Defining Services
sidebar_label: Defining Services
---

Unmock provides a programmatic and interactive way of building services across multiple test files. A **service** in Unmock is any REST API that is being mocked - a microservice, [openweathermap.org](https://openweathermap.org/api), etc.

When using Unmock's programatic API, services are defined in your test files.  Here is a simple example of a GET request in unmock.

```javascript
// mytest.js
import unmock, { compose, u } from "unmock";

unmock("https://www.myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.random.number, // uses `id` from the path
    name: u.name.firstName, // generates a fake name
    age: u.$.age.age, // optionally generates a fake age
    type: 'user', // the literal word "user"
  });
```

When you run your tests, Unmock will use this code to create a service specification in a directory called `__unmock__` at the root of your project. This service specification should be checked into version control.

```bash
$ git add __unmock__/*
```

After creating the specification once, you are free to leave service definitions in your code or delete them. We recommend that you delete them and use the Unmock VSCode plugin or CLI to inspect services after they have been defined.

## Requests and responses

Let's unpack how the simple example above works. For specification building, Unmock has syntax parity with most of [`nock`](https://github.com/nock/nock) (version 10.0.6+).

Creating requests and responses is done with the `unmock.u` object, which exposes a number of useful fake-data-generating tools, mostly from the [`faker`](https://github.com/marak/Faker.js/) JS library.

```javascript
import { u } from "unmock";
const response = {
  id: u.random.number, // generates a random number
  name: u.internet.userName, // generates a random username
  country: u.address.countryCode // generates a random country code
}
```

A list of fake data generators is available on the [Faker.js website](https://github.com/marak/Faker.js/). Unmock augments this list with the following additional generators.

- age
  - age
  - ageSinceEpoch
- zodiac
  - sign
  - horoscope
- currency
  - currency
  - rate
- comment
  - shortPositive
  - shortNegative
  - longPositive
  - longNegative

In addition to fakers, unmock also provides sveral additional utilities for specifying mock data.

### Optional fields

Any of the fields above can be specified as optional by prepending a `$.` before their definition.

```javascript
import { u } from "unmock";
const retval = {
  sign: u.zodiac.sign, // will always return the sign
  horoscope: u.$.zodiac.horoscope // will optionally return the horoscope
}
```

### Cross referencing

If you need to use a field from a path, query, header, cookie, request or response, use the underscore (`_`) followed by the field you would like to use.

```javascript
import { u } from "unmock";
const retval = {
  id: u._.id, // will grab a field called id (see below)
  name: u.name.firstName
}
```

Unmock looks for this field in the path, query, request header, cookie, request, response header, and response in that order. In case you need to further specify which object to draw a field from, you can treat underscore as a function that accepts a field address.

```javascript
import { u } from "unmock";
const retval = {
  reqHeaderId: u._("requestHeader").id, // id from the request header
  reqId: u._("request.user.info").id, // id from the request
  pathId: u._("path").id, // id from the path
  queryId: u._("query").id, // id from the query
  cookieId: u._("cookie").id, // id from the cookie
  resHeaderId: u._("responseHeader").id, // id from the response header
  resId: u._("response.details").id // id from the response
}
```

In the example above, the `request` and `response` versions also provide a path to the ID to use. For example, `response.user.info.id` would retrieve the `id` field from a response with the following shape.

```json
{
  "user": {
    "info": {
      "id": 42
    }
  }
}
```

### Constant values

Sometimes, an API will return a constant value. In this case, you can just use a constant and forego the `u` object.

```javascript
import { u } from "unmock";
const retval = {
  type: 'user',
  name: u.name.firstName
}
```

### Enums

You can specify enums with the `u.enum` function.

```javascript
import { u } from "unmock";
const retval = {
  type: u.enum['friend', 'enemy', 'frenemy'],
  name: u.name.firstName
}
```

### Arrays

Often times, you need to generate an array of objects. To do this, simply define an object using one of the strategies above and then use `u.array` to define how the array should look.

```javascript
const userObj = {
  id: u.random.number,
  name: u.name.firstName
}
const retval = {
  users: u.array.fromObject(userObj)
}
```

The function `u.array.fromObject` takes an object definition and an optional `options` object. Its cousin `u.array.fromObjects` works the same way except that it takes a list of object definitions.  The options object takes the following fields.

```javascript
const userObj = {
  id: u.random.number,
  name: u.name.firstName
}
const retval = {
  users: u.array.fromObject(userObj, {
    minval: 1,
    maxval: 15
  })
}
```

### Functions

For fine-grained control over the generation of mock data, you can use a function as input to any parameter. In general, mocking with this level of specificity is not a good idea: it means that the tests are too specific *or* we are missing a useful abstraction in our code base. If it is the latter, then [pull requests](https://github.com/unmock/unmock-js) are welcome!

The function takes one argument: an options object with the following fields.

```javascript
const retval = {
  type: 'user',
  strangeField: ({
    path,
    query,
    cookie,
    requestHeader,
    request,
    responseHeader,
    response
  }) => [
    path,
    query.name,
    cookie.timestamp,
    requestHeader.ContentType,
    request.user.id,
    responseHeader.UserAgent,
    response.type
  ].join("-")
}
```

## Verbs

Like in `nock`, unmock supports all standard HTTP(S) verbs.

### GET requests

GET requests can be built like this.

```javascript
import unmock, { u } from "unmock";

unmock('https://api.myapi.com')
  .get('/user/{id}')
  .reply(200, {
    id: u._.id,
    name: u.name.firstName
  })
```

### POST requests

POST requests can be defined similar to GET requests, with an optional body as a second argument to `post`.

```javascript
import unmock, { u } from "unmock";

unmock('https://api.myapi.com')
  .post('/user/{id}', {
    name: u.name.firstName,
  })
  .reply(200, {
    id: u._.id,
    name: u.name.firstName
  })
```

### Other verbs

In addition to GET and POST, Unmock supports PUT, DELETE, PATCH, OPTIONS, and HEAD.

```javascript
unmock('https://api.myapi.com')
  .delete('/user/{id}')
  .reply(200);
```

## Headers

Unmock allows you to specify request headers as a second argument to the `unmock` function.

```javascript
import unmock, { u } from "unmock";

unmock('https://api.myapi.com', reqheaders: {
  ["X-Unmock-Is"]: u.enum(["Awesome", "Truly Awesome"])
})
  .get('/user/{id}')
  .reply(200, {
    id: u._.id
  });
```

Response headers can be specified as a third argument to the `reply` function.

```javascript
unmock('https://api.myapi.com')
  .get('/user/{id}')
  .reply(200, {
    id: u._.id
  }, {
    ["X-LastSeen"]: u.number.timestamp
  });
```

## Changing specifications

As previously mentioned, you can feel free to delete the code above after you run it for the first time.  However, if you change the service definition, or if you create a second one that conflicts with the first, unmock will throw an error.

When unmock fails because a service has changed, there are two ways to fix the problem - migration and updating.

### Migrate

In *migration*, unmock deletes the previous service specification and replaces it with a new one.

```javascript
unmock("https://www.myapi.com")
  .migrate
  .get("/users/{id}")
  .reply(200, {
    id: u._.random.number,
    username: u.internet.userName,
    type: 'user',
  });
```

If `unmock.migrate` results in a no-op, it will raise an error. This is to prevent you from leaving dangling migrations in your code base. 

### Update

Unmock `update` works in a similar fashion: it updates the previous specification with new information.

```javascript
unmock("https://www.myapi.com")
  .update
  .get("/users/{id}")
  .reply(200, {
    name: u.name.lastName,
    type: u
  });
```

Like migrate, an update that is a no-op will raise an error.

## Working with services

As mentioned, it is generally a good idea to delete service descriptions from your test files. However, when you are working with test files, it is often useful to have an overview of how services behave. In order to view service descriptions, unmock provides a [CLI](cli.md) and [VS Code](vscode.md) plugin.