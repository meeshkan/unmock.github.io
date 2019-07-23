---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Unmock is a JavaScript testing library that allows you to write comprehensive tests for third-party API integrations.

Inspired by libraries like [`nock`](https://github.com/nock/nock) and [`hoverfly`](https://github.com/spectolabs/hoverfly), Unmock aims to simplify the integration testing process by creating a small, isolated, ephemeral stack for every test that makes a network call. This stack represents the world outside your test, and is Just Good Enough™ to reliably mock that world so that your tests pass when they should and, more importantly, fail when they should.

## How it works

```javascript
// user.test.js
import unmock from "unmock-node";

// Activate unmock to intercept all outgoing traffic
const states = unmock.on();

test("returns correct response", async () => {
  states.github({ id: 1 }); // Modify service state, return "id" 1
  const fetchResult = await fetch("https://api.github.com/user"); // Fetch data
  expect(fetchResult.json().id).toBe(1);
});
```

Get started with unmock in the full [Hello World example](hello.md).

## Motivation

Services are the glue connecting modern applications: for example, the GitHub API is a service. Every service has a specification describing how the service behaves, be either written documentation, [OpenAPI](https://www.openapis.org/), [RAML](https://raml.org/), or something else. The specification for a service is _reusable_ across applications.

Still, when testing how our applications integrate with external services, we rarely use the specifications directly. Instead, we write adhoc rules for how the services should behave. Writing such rules is error-prone, time-consuming, and hard to maintain.

This is what unmock wants to fix. Testing the integration with external services should start from the _service specification_. Setting the service _state_ should happen programmatically before every test. The state should be _consistent_ with the service specification.

## Next steps

1. Get started with a [Hello World example](hello.md)
1. [Install](installation.md) unmock
1. Learn about [services](layout.md)
