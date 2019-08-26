---
id: states
title: Setting the State
sidebar_label: Setting the State
---

Sometimes, it is not enough to verify that a function handles any old API response correctly. You'll often want to verify that a function reacts to *specific data* from an API in a predictable way. To do this, unmock exposes a **state** property for each service.

```javascript
// Access services via unmock.services:
import unmock, { services } from "unmock-node";

// Or via unmock.on():
const { services } = unmock.on();

// Get a service having `state` property.
const github = services.github;
```

> Beware: `unmock.services` will not contain any services if you haven't called `unmock.on()` or defined any services.

To modify the state for a service named `github`, you call methods on `github.state` as described below, allowing you to set specific response bodies for any HTTP method and path.

## Modifying response body

### JSON response

To modify response bodies for content type `application/json` for a service named `github`, you may:

- Call `github.state` with the state you would like to return:

  ```javascript
  // Sets the `repository` field _anywhere_ in the response body to "unmock-js"
  github.state({ repository: "unmock-js" });
  ```

  Unmock automatically finds out which endpoints and which HTTP methods this state change applies to and only applies the state change to those endpoints.

- Call `github.state` with the path for which you'd like to define a new state:

  ```javascript
  // Set the `name` field to "sparky" for the response to any HTTP operation at `/user`
  github.state("/user", { name: "sparky" });
  ```

  > Tip:
  > You can also use wildcards for single path item replacements:
  >
  > ```javascript
  > github.state("/users/*", { name: "lucy" });
  > ```

- Call `github.state` with a specific HTTP method within the service:

  ```javascript
  // Set the `name` field to "still sparky" for a GET request to `/user/sparky`
  github.state.get("/users/sparky", { name: "Still Sparky" });
  ```

### Text response

If the service returns content type of `text/plain` and you want to set a specific text response, you can replace the object inputs above with plain strings:

```javascript
const petstore = unmock.services.petstore;

// Sets the text response for any operation to any path to "Document not found"
petstore.state("Document not found");

// Sets the text response for any operation to `/path` to "Document not found"
petstore.state("/path", "Document not found");

// Sets the text response for `GET /path` to "Document not found"
petstore.state.get("/path", "Document not found");
```

### Using a function as state

Often you want to set the response body programmatically based on the intercepted request. This can be done by using a function as state input as follows:

```javascript
// Return the last element of the path as login field
github.state.post("/users/*", req => ({ login: req.path.split("/").pop() }));
```

or in TypeScript with typing:

```typescript
import { UnmockRequest } from "unmock-node";

states.github.post("/users/*", (req: UnmockRequest) => ({
  login: req.path.split("/").pop(),
}));
```

Note that the object returned from the function will be set as the _full_ response body.

Request object contains the following fields:

- `host`: request hostname, for example, `"api.github.com"`
- `headers`: request headers
- `body`: request body
- `method`: request method, for example, `"GET"`
- `protocol`: either `"http"` or `"https"`
- `path`: request path

> Note that path and query parameters are not automatically parsed in the `UnmockRequest` object.

> Tip: You can use the `UnmockRequest` object to verify outgoing requests with the following pattern:
>
> ```javascript
> // Define a mock used as request handler
> const mockRequestHandler = jest.fn().mockImplementationOnce((req) => "Any response");
> // Call the mock for intercepted requests
> petstore.state((req) => mockRequestHandler(req));
> // Run your code calling the service...
> // Then run your asserts
> expect(mockRequestHandler).toHaveBeenCalledWith({
>   expect.objectContaining({
>     body: "Expected body"  // Verify request body
>     method: "GET",
>   }),
> });
> ```

## Modifying response code

To make the service return a specific status code such as 404, use the `$code` variable in the state input:

```javascript
const petstore = unmock.services.petstore;

// Sets the response code for any operation to any path to 404
petstore.state({ $code: 404 });

// Return `{ message: "Not found" }` and code 404
petstore.state({ message: "Not found", $code: 404 });
```

You can use the same `petstore.state.get` and `petstore.state("/path")` constructs as above to set the state for specific operations and paths, respectively.

## Resetting the state

Reset a specific service state or the whole service:

```javascript
github.state.reset(); // Reset the state for `github`
github.reset(); // Reset the service, including state
```

## Fluent API

`state` object exposes a fluent API so you can chain multiple calls to set multiple states:

```javascript
github.state
  .get("/users/sparky", { name: "Still Sparky" })
  .get("/users/lilo", { name: "Lilo" });
```

> Warning: You cannot chain new calls after `reset()` with the fluent API.

## Merged state

Once the states are set and a request is captured, it is matched against the service and the most specific state is being used to generate the response. For example, assume the following state is being set:

```javascript
petstore.state({ id: -999 });
petstore.state("/pets/*", { name: "Finn" });
petstore.state("/pets/1", { id: 1 });
```

The following calls will generate the matching responses:

```javascript
fetch(`${PETSTORE_URL}/pets/1`); // -> { id: 1, name: "Finn" }
fetch(`${PETSTORE_URL}/pets/3`); // -> { id: -999, name: "Finn" }
fetch(`${PETSTORE_URL}/pets/513`); // -> { id: -999, name: "Finn" }
fetch(`${PETSTORE_URL}/pets`);
// -> [{ id: -999, name: randomly generated }, { id: -999, name: generated }, ... ]
```
