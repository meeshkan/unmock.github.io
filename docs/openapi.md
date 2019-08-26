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

## Pulling a spec from [DefinitelyMocked](https://github.com/unmock/definitelymocked)

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

> If you are using typescript, make sure to add `unmock ts` as a post install hook to have types generated for your OpenAPI specs.

Now, Unmock will automagically mock Stripe V3 whenever you call it.

## Composing with the CLI or VS Code

The Unmock CLI and VS Code plugins both allow for you to compose services. This section will explore how to do this with the CLI. The VS Code plugin is self documenting from the Unmock pane in VS Code.

```bash
$ unmock add https://myapi.com/me get response 200 application/json id number
$ unmock show https://myapi.com
paths:
 /me:
   get:
     response:
       200:
         application/json:
           type: object
           properties:
             id:
               type: integer
```

## Manual OpenAPI spec creation

*Some text*

## Lazy Open API 3 (loas3)

Often you have an OpenAPI specification available for a service. Mature projects and companies, such as Stripe and Slack, tend to have robust OpenAPI specifications that account for API corner cases and cover all API endpoints. However, if a specification is not available, you will need to deal with APIs that have incomplete or no OpenAPI documentation. In this case, if you do not want to define a spec programatically, you will need to write your own OpenAPI.

To help overcome the verbosity and tedium of hand-rolling an OpenAPI spec, Unmock can process [`loas3`](https://www.github.com/unmock/loas3), or Lazy OpenAPI 3, a syntactic superset of OpenAPI 3.0.0. This section gives a quick primer of the `loas3` specification. In addition to being easier to read and write, the specification usually results in documents that are 50% the size (or less!) of their more verbose OpenAPI counterparts.

### Cascading objects

Lazy Open API 3 allows you to omit information when you create a path, and provides sensible defaults when you do. The defaults work as follows.

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

Thus:

```yaml
paths:
  /my-path:
    type: string
    default: foo
```

Is the same as

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

### Schemas

`loas3` infers the schema from types if you provide an example of a return object. Thus:

```yaml
paths:
  /my-path: 1
```

Is the same as:

```yaml
paths:
  /my-path:
    get:
      responses:
        default:
          content:
            application/json:
              schema:
                type: integer
                format: int64
                default: 1
                example: 1
```

One gotchya is that, if you use one of the keywords that can actually be part of a [Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject), `loas3` will treat the object like a Schema.

> In unmock, `default` response is translated to a 200 response code.

### Parameters

In addition to the way parameters are expressed in OpenAPI, parameters can be specified in one of two lazy formats.

#### Somewhat lazy

You can define `query`, `header`, `cookie` and `path` parameters as follows:

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

Is the same as:

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

#### Supremely lazy

For the unbearably, pathologically, irrecoverably lazy, you can just list the parameters as key-value pairs. They default to query unless they are in the enclosing path:

```yaml
paths:
  /my-path/{bar}:
    get:
      parameters:
        foo: 1
        bar: hello
```

is the same as:

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
