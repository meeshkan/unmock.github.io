---
id: installation
title: Getting started with Unmock
sidebar_label: Getting started with Unmock
---

Welcome! 👋

Unmock is a JavaScript library that helps you test API integrations, from third-party services like Facebook to microservices. It helps you focus more on verifying the correctness of your code and less on reverse engineering external APIs.

## Three Great Ways to Start

We provide three ways to get your feet wet in Unmock depending on what kind of learner you are.

1. **The Unmock Koans.** [Click here](https://github.com/unmock/unmock-koans) to start using Unmock Koans, an interactive, fun, and highly recommended way to learn Unmock.
2. **Unmock Katacoda.** There are several Unmock scenarios deployed on [Katacoda](https://katacoda.com/unmock) that cover the most important use cases of Unmock.
3. **This Documentation.** We wrote this documentation to be read sequentially so that, by the end, you will know everything you need to know to use Unmock with confidence.

## Installation

Unmock can be installed via `yarn` or `npm`.

### yarn

```bash
$ yarn add -D unmock-node
```

### npm

```bash
$ npm i -D unmock-node
```

## Turning Unmock on and off

To turn Unmock on in any given file, simply call `unmock.on()`. For example, if you are using Jest, it is a good idea to turn Unmock on before each test or before all tests.

```javascript
const unmock = require('unmock');
beforeAll(() => {
  unmock.on();
});
```

Similarly, you can turn Unmock off with `unmock.off()`.

```javascript
const unmock = require('unmock');
afterAll(() => {
  unmock.off();
});
```