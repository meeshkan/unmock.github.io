---
id: installation
title: Installation
sidebar_label: Installation
---

## [NPM](https://www.npmjs.com)

### yarn

```bash
$ yarn add -D unmock-node
```

### npm

```bash
$ npm i -D unmock-node
```

## Usage

To activate Unmock and start intercepting internet traffic, call `unmock.on()`. Deactivating Unmock is similarly easy - `unmock.off()`.

```javascript
// import unmock from "unmock-node";  // For ES6 modules
const unmock = require("unmock-node");

beforeAll(() => unmock.on()); // Activate unmock to intercept all outgoing traffic
// Test your code...
afterAll(() => unmock.off());
```

Calling `unmock.on()` takes care of intercepting traffic, but how should Unmock know what data it should serve back to mock the service? That requires defining [services](layout.md).

## Next steps

1. See [configuration](configuration.md) for how to configure Unmock.
1. Learn about [services](layout.md)
