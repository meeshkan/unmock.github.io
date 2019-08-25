---
id: configuration
title: Configuration
sidebar_label: Configuration
---

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

