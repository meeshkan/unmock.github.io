---
id: fetching
title: Fetching services
sidebar_label: Fetching services
---

While there is no default way to fetch services, most OpenAPI specifications of popular third-party libraries are published online. [api.guru](https://apis.guru/browse-apis/) has a great list of them.

To use the Stripe API, for example, you can do the following.

```
$ mkdir -p __unmock__/stripe && cd __unmock__/stripe
$ wget https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.yaml
```

We recommend checking all service specifications into version control.
