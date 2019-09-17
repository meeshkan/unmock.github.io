---
id: introduction
title: Getting Started
sidebar_label: Getting Started
---

Welcome! 👋

Unmock is a JavaScript library that helps you test API integrations, from third-party services like Facebook to microservices. It helps you focus more on verifying the correctness of your code and less on reverse engineering external APIs.

## Installation

Unmock can be installed via `yarn` or `npm`.

<!--DOCUSAURUS_CODE_TABS-->

<!--yarn-->

```bash
$ yarn add -D unmock
```

<!--npm-->

```bash
$ npm install --save-dev unmock
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Turning Unmock on and off

To turn Unmock on in any given file, simply call `unmock.on()`. For example, if you are using Jest, it is a good idea to turn Unmock on before each test or before all tests.

```javascript
const unmock = require("unmock").default;
// import unmock from "unmock";  // ES6

beforeAll(() => {
  unmock.on();
}); // Activate unmock to start intercepting traffic
```

Similarly, you can turn Unmock off with `unmock.off()`.

```javascript
const unmock = require("unmock").default;
// import unmock from "unmock";  // ES6
afterAll(() => {
  unmock.off();
});
```
