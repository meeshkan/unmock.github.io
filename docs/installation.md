---
id: installation
title: Getting started with Unmock
sidebar_label: Getting started with Unmock
---

Welcome! 👋

Unmock is a JavaScript library that helps you test API integrations, from third-party services like Facebook to microservices. It helps you focus more on verifying your business logic and less on reverse engineering external APIs.

## Installation

Not surprisingly, Unmock can be installed via `yarn` or `npm`.

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

## Configuration

Unmock has several different configuration options, each of which can be configured programatically or in an `unmock.json` file at the root level of your project. The latter will apply your configuration to all files that use Unmock.

### Adding allowed hosts

By default, Unmock intercepts all traffic to internet. If you want to allow communication with specific hosts, you can add a hosts via `allowedHosts`.

<!--DOCUSAURUS_CODE_TABS-->

<!--JSON-->
```json
{
  "allowedHosts": ["*.googleapis.com", "*.azure.com"]
}
```

<!--JavaScript-->
```javascript
const unmock = require('unmock');
unmock.allowedHosts.add("*.googleapis.com");
unmock.allowedHosts.add("*.azure.com");
```

<!--END_DOCUSAURUS_CODE_TABS-->

