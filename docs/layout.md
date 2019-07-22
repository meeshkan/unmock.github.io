---
id: layout
title: Service layout
sidebar_label: Service layout
---

In Unmock, a service represents a third-party API or microservice with which your codebase interacts. Things like Stripe, Facebook, or that pesky microservice you use to make sure users' avatars are up-to-date are all services.

## Directory structure

Every service in unmock should be in a subfolder of the `__unmock__` folder in the root directory of a project. The subfolders must not be one of the following reserved keywords: `get, post, patch, delete, options, head, put, reset`. Generally, for clarity, it is a good idea to name them after the service, as the subfolder name as how you will later interact with the service state. So, for example, if you are interacting with the GitHub API, `__unmock__/github` should contain the service definition for the GitHub API.

```
__unmock__/
    github/
        index.yaml
    slack/
        index.yaml
package.json
src/
tests/
```

We'll talk about how to fetch the GitHub and other service definitions in [Fetching Services](/fetching).

## Service specification

In Unmock, services are simply documents designed according to the [OpenAPI 3.0.0 specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md).

Unmock is able to turn most OpenAPI specifications into viable mocks without any tinkering, but there are a few service extensions we provide to make the mocks moxier. Unmock uses the `x-` pattern defined in the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#specificationExtensions).

Unmock also supports Lazy OpenAPI 3, which we will explore in the next section.
