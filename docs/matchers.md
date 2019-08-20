---
id: matchers
title: Expectations for APIs
sidebar_label: Matchers for expectations
---

When writing unit tests for code using external services, you want to test two things:

1. Verify **outgoing requests are correct**
1. Verify **incoming responses are handled correctly**

You do not want to test, for example, that the external service works as its specifications says. You expect the service to honor its contract and return valid data for valid requests. Of course, you still want to test the behaviour of your app when things break and the service returns status 500, for example.

Points I'd like to make here:

1. You want to separate the concern of **creating a request from making the request**
1. You want to separate the concern of **handling the response from getting the response**

## Testing outgoing requests

#### With nock

When using libraries like `nock`, you find yourself writing following code:

```js
// Given
const mockFunction = jest.fn();
nock.scope(serviceUrl).reply(mockFunction);

// When
// Run the code hitting serviceUrl...

// Then
expect(mockFunction).toHaveBeenCalledWith(expectedUrl, expectedData);
```

To avoid using mock functions, one can also abuse `nock` to return the request body so one can verify the request you made:

```js
// Given
const expectedRequestBody = ...;
nock.scope(serviceUrl).reply(200, (_, requestBody) => requestBody);

// When
// const response = await makeRequest();

// Then
expect(response).toEqual(expectedRequestBody));
```

Of course, this feels like unnecessary trickery.

#### With unmock 1: Maintain list of calls, very similar to yesno

```js
const requestResponsePairs = github.calls;

// Needs some kind of unzip or helper
const requests = requestResponsePairs.map((pair) => pair.request);

expect(requests).toHaveLength(1);

const request = requests[0];
// Using jest-matchers
// Hard to read
expect(request).toEqual(expect.objectContaining({ body: expectedBody }));

// Using jest-matchers, slightly better
expect(request.body).toEqual(...)
expect(request.method).toEqual("GET");

// Go custom?
expect(request).body.toEqual(...)
```

#### With unmock 2: Abuse states

```js

// Feels very nockish
states.github.post("/users", (request, response) => {
    expect(request.body).toEqual(...);
    return response;
});

// Verify expects were done
// states.verifyDone();

```

#### With unmock 3: Adopt a [SinonJS](https://sinonjs.org/releases/v7.4.1/)-like spy API

```js
// SinonJS spy syntax:
// https://sinonjs.org/releases/v7.4.1/spies/
assert(spy.calledWith(sinon.match({ author: "cjno" })));

// Service is a "SinonJS spy"
assert(github.calledOnceWith({ body: someBody, path: "/v1" }));

// Add custom expects for wrapping spy behaviour
expect(github).calledOnceWith({ body: "cjno", path: "/v1" });
expect(github).calledTimes(3);

// Accessing calls
const { request, response } = github.firstCall;
// With `getCall`:
const { request, response } = github.getCall(2);
// Matchers for easy working with requests and responses
expect(request).toEqual(unmock.match({ body: "Hello" }));

// Do we need `unmock.match`?
expect(github).calledWith(
  expect.objectContaining({ body: "cjno", path: "/v1" })
);

// Access given paths or e.g. method by using a filter returning a "subset spy"?
expect(github.path("/users")).calledOnce();
expect(github.method("GET")).calledOnce();
expect(github.with({ path: "/users", method: "GET" })).calledOnce();
```

#### With unmock 4: Go fully custom ([REST-assured](http://rest-assured.io/))

```js

// Something like
given(states.github({ $code: 500 }))
    .when(runCodeHere)
    .then(
        assertThat(
            expect(requests).toHaveLength(1);
            expect(requests[0]).toHavePath({ ... });
            expect(requests[0]).toHaveBody({ ... });
        )
);

```

## Testing the handling of incoming responses

```js
expect(github).toHaveReceivedRequest({
  path: "/",
  method: "GET",
  query: { user: "Meeshkan" },
});
expect(github)
  .toHaveReceivedRequest()
  .withMethod("GET");

expect(github.calls).toHaveLength(1);

// Verifies also request by sufficient filtering?
const response = github.calls({ path: "/" });
expect(response).toHaveMethod("GET");
expect(response).toHaveBody("...");

// Is this a bad idea, breaks fluent API?
const response = expect(github).calledWith(
  unmock.match({ body: "cjno", path: "/v1" })
);
```

### Notes

- [REST assured](https://techbeacon.com/app-dev-testing/how-perform-api-testing-rest-assured)
- [Mocks vs. stubs vs. spies](https://github.com/goldbergyoni/javascript-testing-best-practices#-%EF%B8%8F-%EF%B8%8F15-choose-the-right-test-doubles-avoid-mocks-in-favor-of-stubs-and-spies)
- [Use realistic fake data](https://github.com/goldbergyoni/javascript-testing-best-practices#-%EF%B8%8F16-dont-foo-use-realistic-input-dataing)
- Are services spies, stubs, or mocks?
  - For mocks, how to define expectations on "methods" called?
  - For stubs, how to verify correct requests were made?
- Read about [SinonJS](https://sinonjs.org/releases/v7.4.1/) and how it's used for API testing (especially the [spy](https://sinonjs.org/releases/v7.4.1/spies/) API)
- What if services were SinonJS spy objects called with requests
- Logic should be in the test.
