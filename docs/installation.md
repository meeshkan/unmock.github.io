---
id: installation
title: Getting started with Unmock
sidebar_label: Getting started with Unmock
---

Welcome! 👋

Unmock is a JavaScript library that helps you test API integrations, from third-party services like Facebook to microservices. It helps you focus more on verifying your business logic and less on reverse engineering external APIs.

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

## Turning Unmock on

To turn Unmock on in any given file, simply call `unmock.on()`.

```javascript
const unmock = require('unmock');
unmock.on();
```

