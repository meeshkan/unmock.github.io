---
id: activation
title: Activating Unmock
sidebar_label: Activating Unmock
---

Turning Unmock on is quite easy - `unmock.on()`, `unmock.init()` and `unmock.initialize()` (for the extremely verbose) all accomplish the same thing.
Turning Unmock off is similarly easy - `unmock.off()`.

```javascript
const unmock = require("unmock-node");

unmock.on(); // Activate unmock to intercept all outgoing traffic
// Test your code
unmock.off();
```

Once activated, Unmock prevents your code from communicating with the internet, excluding `localhost`. This ensures your code is not exposing any test data (or, more crucially, real world data) to any external services.

If needed, you may pass an array of regular expressions or wild-carded URLs when turning Unmock on:

```javascript
unmock.on({ whitelist: ["127.0.0.1", "*.googleapis.com"] });
```
