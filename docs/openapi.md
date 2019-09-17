---
id: openapi
title: Using OpenAPI
sidebar_label: Using OpenAPI
---

Unmock supports service descriptions in two different flavors of OpenAPI: vanilla OpenAPI and Lazy OpenAPI 3 (loas3).

## Your first OpenAPI Spec in Unmock

There are three ways to incldue OpenAPI in an unmock project.

1. Pull in an OpenAPI spec from [DefinitelyMocked](https://github.com/unmock/definitelymocked) or another package.
1. Use the Unmock CLI or VS Code plugin to compose and edit specifications.
1. Write or paste an OpenAPI file directly in the `unmock` directory.

## Pulling a spec from DefinitelyMocked

Lots of companies define OpenAPI specs for their APIs, and several projects, such as [apis.guru](https://apis.guru) and [OpenAPI Directory](https://github.com/APIs-guru/openapi-directory), act as a directory of OpenAPI specs.  We maintain our own directory, called [DefinitelyMocked](https://github.com/unmock/definitelymocked), that you can use right from the Unmock CLI.

To import a spec from DefinitelyMocked, you can use `npm` or `yarn`. The following example imports the OpenAPI spec for the Stripe Version 3 API.

<!--DOCUSAURUS_CODE_TABS-->

<!--yarn-->
```bash
$ yarn add -D @unmock/stripe3
```

<!--npm-->
```bash
$ npm install --save-dev @unmock/stripe3
```

<!--END_DOCUSAURUS_CODE_TABS-->

> If you are using typescript, make sure to add `unmock ts` as part of the `postinstall` script in `package.json`  to have types generated for your OpenAPI specs.

Now, Unmock will automagically mock Stripe V3 whenever you call it.

## Composing with the CLI

The Unmock CLI and VS Code plugins both allow for you to compose services. This section will explore how to do this with the CLI. The VS Code plugin is self documenting from the Unmock pane in VS Code.

### Associating a URL with an API

To associate a URL with an API, use `unmock associate`.

```bash
$ unmock associate myapi https://myapi.com
```

Now, the endpoint `https://myapi.com` is associated with `myapi`. If you associate the same URL with two different APIs, unmock will throw an error.

### Adding information

You can add information to an API with the `unmock add` command.

```bash
$ unmock add -h
usage: unmock add [api] [path] [verb] responses [code] content [media-type] key value
usage: unmock add [api] [path] [verb] responses [code] headers key value
usage: unmock add [api] [path] [verb] parameter [query/path/header/cookie] key value
$ unmock add myapi "/user/{id}" get parameter path id random.number
$ unmock add myapi "/user/{id}" get responses 200 content application/json id random.number
$ unmock add myapi "/user/{id}" get responses 200 content application/json info.name name.firstName
$ unmock show myapi "/user/{id}"
/user/{id}:
  get:
    parameters:
      - in: path
        description: An id in the path.
        name: id
        type: integer
    responses:
      200:
        application/json:
        content:
          schema:
            type: object
            properties:
              id:
                type: integer
              info:
                type: object
                properties:
                  country:
                    type: string
                    x-unmock-faker: address.countryCode
```

### Deleting information

You can add information to an API with the `unmock delete` command.


```bash
$ unmock delete -h
usage: unmock delete [api] [path] [verb] responses [code] content [media-type] key
usage: unmock delete [api] [path] [verb] responses [code] headers key
usage: unmock delete [api] [path] [verb] parameter [query/path/header/cookie] key
$ unmock add myapi "/user/{id}" get responses 200 content application/json info.name
$ unmock show myapi "/user/{id}"
/user/{id}:
  get:
    parameters:
      - in: path
        description: An id in the path.
        name: id
        type: integer
    responses:
      200:
        application/json:
        content:
          schema:
            type: object
            properties:
              id:
                type: integer
```


## Manual OpenAPI spec creation

Sometimes, you just want to copy and paste an OpenAPI spec or write one yourself. In this case, Unmock supports the addition of OpenAPI specs directly into the `__unmock__` directory. The only thing you need to do is make sure the spec is in YAML and is located in a subdirectory that represents the specification's logical name.  For example, if you have an OpenAPI spec for `https://api.cutekittens.io` and would like to refer to this as `cutekittens`, you can place the spec in `__unmock__/cutekittens/index.yml`. It will then be referenceable from the unmock.services object.

```javascript
import { services: { cutekittens } } from "unmock";
// now you can use a mock of the cutekittens.io API
```

## Lazy Open API 3 (loas3)

To help overcome the verbosity and tedium of writing an OpenAPI spec, Unmock can process [`loas3`](https://www.github.com/unmock/loas3), or Lazy OpenAPI 3, a syntactic superset of OpenAPI 3.0.0. This section gives a quick primer of the `loas3` specification. In addition to being easier to read and write, the specification usually results in documents that are 50% the size (or less!) of their more verbose OpenAPI counterparts.

### Cascading objects

Lazy Open API 3 allows you to omit information when you create a path, providing sensible defaults for all omissions. The defaults work as follows.

```yaml
paths:
  /my-path:
    [get]:
      [responses]:
        [default]:
          [content]:
            [application/json]:
              [schema]:
                type: string
```

Below, you can see how the lazy definition of an object is expanded to full OpenAPI


<!--DOCUSAURUS_CODE_TABS-->

<!--lazy-->
```yaml
paths:
  /my-path:
    type: string
    default: foo
```

<!--expanded-->
```yaml
paths:
  /my-path:
    get:
      responses:
        default:
          content:
            application/json:
              schema:
                type: string
                default: foo
```

<!--END_DOCUSAURUS_CODE_TABS-->


### Schemas

`loas3` infers the schema from types if you provide an example of a return object. In the example below, the return object is an object with two properties - `id` and `name`. `loas` is smart enough to expand this to the OpenAPI definition of an object with two properties.

<!--DOCUSAURUS_CODE_TABS-->

<!--lazy-->
```yaml
paths:
  /my-path:
    id: 1
    name: Anne
```

<!--expanded-->
```yaml
paths:
  /my-path:
    get:
      responses:
        default:
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    format: int64
                    default: 1
                    example: 1
                  name:
                    type: string
                    default: Anne
                    example: Anne
```

<!--END_DOCUSAURUS_CODE_TABS-->

One gotchya is that, if you use one of the keywords that can actually be part of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject), `loas3` will treat the object like a Schema.

> In unmock, `default` response is translated to a 200 response code.

### Parameters

In addition to the way parameters are expressed in OpenAPI, parameters can be specified in one of two lazy formats.

#### Somewhat lazy

You can define `query`, `header`, `cookie` and `path` parameters in an object under `parameters` and it will be expanded into a valid OpenAPI parameters object.

<!--DOCUSAURUS_CODE_TABS-->

<!--lazy-->
```yaml
paths:
  /my-path:
    get:
      parameters:
        query:
          foo: 1
        header:
          Authorization: { type: string }
```

<!--expanded-->
```yaml
paths:
  /my-path:
    get:
      parameters:
        - in: query
          name: foo
          schema:
            type: number
            format: int64
            default: 1
            example: 1
        - in: header
          name: Authorization
          schema:
            type: string
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### Supremely lazy

For the unbearably, pathologically, irrecoverably lazy, you can just list the parameters as key-value pairs. They default to query unless they are in the enclosing path.

<!--DOCUSAURUS_CODE_TABS-->

<!--lazy-->
```yaml
paths:
  /my-path/{bar}:
    get:
      parameters:
        foo: 1
        bar: hello
```

<!--expanded-->
```yaml
paths:
  /my-path:
    get:
      parameters:
        - in: query
          name: foo
          schema:
            type: number
            format: int64
            default: 1
            example: 1
        - in: path
          name: bar
          schema:
            type: string
            default: hello
            example: hello
```

<!--END_DOCUSAURUS_CODE_TABS-->
