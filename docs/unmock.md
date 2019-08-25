---
id: unmock
title: Programmatic Simulations
sidebar_label: Programmatic Simulations
---

Unmock provides a programmatic and interactive way of building services across multiple test files. A **service** in Unmock is any REST API that is being mocked - a microservice, weather.com, etc.

When using Unmock's programatic API, services are defined in your test files.  Here is a simple example of a GET request in unmock.

```javascript
// mytest.js
import unmock, { compose, u } from "unmock";

unmock("https://www.myapi.com/users/{id}")
  .serve({
    id: u._.id, // uses `id` from the path
    name: u.name., // generates a fake name
    age: u.$.age., // optionally generates a fake age
    type: 'user', // the literal word "user"
  });
```

When you run your tests, Unmock will use this code to create a service specification in a directory called `__unmock__` at the root of your project.  The service specification is written in OpenAPI and should be checked into version control. After creating the specification once, you are free to leave calls to `unmock.serve` in your code or delete them. We recommend that you delete them and use the Unmock VSCode plugin or CLI to inspect services after they have been defined.

## Defining specifications

Let's unpack how the simple example above works. *Explanation*.

Here are some more snippets to get you familiar with Unmock's syntax. *Snippets*

The reference manual contains an exhaustive list of Unmock's commands for service description.

## Changing specifications

As previously mentioned, you can feel free to delete the code above after you run it for the first time.  If you leave it, it will do no harm but you will see an *dangling service definition* warning in your tests. However, if you change the service definition, or if you create a second one that conflicts with the first, unmock will throw an error.  This prevents team members from accidentally modifying a service spec on which you are relying.

When unmock fails because a service has changed, there are two ways to fix the problem - migration and updating.

In *migration*, unmock deletes the previous service specification and replaces it with a new one.

```javascript
unmock("https://www.myapi.com/users/{id}")
  .migrate({
    id: u._`id`, // uses `id` from the path
    name: u`name`, // generates a fake name
    age: u`age` // generates a fake age
  });
```

If `unmock.migrate` results in a no-op, it will raise an error. This is to prevent you from leaving dangling migrations in your code base. Unmock update works in a similar fashion: it updates the previous specification with new information.

```javascript
unmock("https://www.myapi.com/users/{id}")
  .update({
    name: u`username`, // generates a fake username
    age: u // delete the age field
  });
```

Like migrate, an update that is a no-op will raise an error.

## Working with services

As mentioned, it is generally a good idea to delete service descriptions from your test files. In order to inspect service descriptions, unmock provides a CLI and VS Code plugin that you can use in realtime as you code.