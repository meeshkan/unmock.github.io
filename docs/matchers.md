---
id: matchers
title: Expectations for APIs
sidebar_label: Matchers for expectations
---

When writing unit tests for code using external services, you want to test two things:

1. Verify **outgoing requests are correct**
1. Verify **incoming responses are handled correctly**

You do not want to test, for example, that the external service works as its specifications says. You expect the service to honor its contract and return valid data for valid requests. Of course, you still want to test the behaviour of your app when things break and the service returns status 500, for example.

### Testing outgoing requests

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

#### Maintaining list of calls for `expect`

```js
const requests = github.calls;

expect(requests).toHaveLength(1);
const { request, response } = expect(github).toHaveBeenCalledOnce();

// Hard to read
expect(request).toEqual(expect.objectContaining({ body: expectedBody }));

// Better
expect(request.body).toEqual(...)
expect(request).body.toEqual(...)

```

#### Go fully custom
```js

given(states.github({ $code: 500 }))
    .when(runCodeHere)
    .then(
        assertThat(
            expect(requests).toHaveLength(1);
            expect(requests[0]).toHavePath({ ... });
            expect(requests[0]).toHaveBody({ ... });
        )
);

assert.calledWith(spy, sinon.match({ author: "cjno" }));

expect(github).calledOnceWith({ body: "cjno", path: "/v1" });

expect(github).calledTimes(3);

const { request, response } = github.getCall(2);

expect(github).calledWith(expect.objectContaining({ body: "cjno", path: "/v1" }));

// Access given paths or e.g. method by using a filter returning a subset?
expect(github.withPath("/users")).calledOnce();
expect(github.withMethod("GET")).calledOnce();
expect(github.callsWith({ path: "/users", method: "GET" })).calledOnce();

```

### Testing the handling of incoming responses

```js
expect(github).toHaveReceivedRequest({
  path: "/",
  method: "GET",
  query: { user: "Meeshkan" },
});
expect(github).toHaveReceivedRequest().withMethod("GET");

expect(github.calls).toHaveLength(1);

// Verifies also request by sufficient filtering?
const response = github.calls({ path: "/" });
expect(response).toHaveMethod("GET");
expect(response).toHaveBody("...");

// Is this a bad idea, breaks fluent API?
const response = expect(github).calledWith(unmock.match({ body: "cjno", path: "/v1" }));

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