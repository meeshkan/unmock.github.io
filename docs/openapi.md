---
id: openapi
title: Using OpenAPI
sidebar_label: Using OpenAPI
---

Unmock supports service descriptions in two different flavors of OpenAPI: vanilla OpenAPI and Lazy OpenAPI 3 (loas3).

OpenAPI specs should be added directly into an `__unmock__` directory at the top-level of your project. The only thing you need to do is make sure the spec is in YAML and is located in a subdirectory that represents the specification's logical name.  For example, if you have an OpenAPI spec for `https://api.cutekittens.io` and would like to refer to this as `cutekittens`, you can place the spec in `__unmock__/cutekittens/openapi.yml`.

```
__unmock__/
  cutekittens/
    openapi.yml
package.json
src/
tests/
```
It will then be referenceable from the unmock.services object.

```javascript
import unmock from "unmock";
const { services: { cutekittens } } = unmock.on();
// now you can use a mock of the cutekittens.io API
```

Any valid OpenAPI 3 specification can be added to your project this way. Many APIs (Stripe, Slack, etc) have mature and robust OpenAPI specifications. If you're wondering whether or not an API you're working with has an OpenAPI specification, API gurus provides an excellent directory of OpenAPI specs.

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

> In unmock, the `default` response is translated to a 500 response code.

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
