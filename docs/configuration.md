---
id: configuration
title: Configuring Unmock
sidebar_label: Configuration
---

## Adding allowed hosts

By default, Unmock intercepts all traffic to internet. If you want to allow communication with specific hosts, you can add a hosts via `unmock.allowedHosts.add()`:

```javascript
// Allow communication with `*.googleapis.com`
unmock.allowedHosts.add("*.googleapis.com");
```
