---
id: property
title: Property Testing
sidebar_label: Property Testing
---

Unmock allows you to property test APIs. To understand if this is a good fit for your code base, it is good to explore what property testing is and when it's useful.

## Property testing 101

Property testing makes sense when you are uncertain about they type of content that a given function will receive or how that content will be transformed into a response. For example, the given function is a poor candidate for property testing.

```ts
const onlyAcceptsTwoThenAddsOne = (n: number) {
  if (n != 2) {
    throw Error(`Hey! I wanted the number two. Not ${n}`)
  }
  return n + 1;
}
```

The function's name, error, and return result makes us pretty confident that two use cases (ie `onlyAcceptsTwoThenAddsOne(2)` and `onlyAcceptsTwoThenAddsOne(-42)`) will sufficiently test `onlyAcceptsTwoThenAddsOne`.

Most trivial functions that have no IO should not be property tested. However, when the function contains several `if/else` branches, or when the function's input can vary drastically because we have no control over it, property testing can find nasty corner cases in milliseconds.

API integrations are generally good candidates for property testing. Unless the API is something like `always-return-two.com` or `unauthorized.io`, chances are that its responses can be subtly different. In this case, simple property tests can save weeks of debugging time down the line!

## Unmock and property testing

Unmock supports property testing as a first class citizen via the `unmock.pt` object.  The four most common ways to do API property testing are `unmock.pt.fails`, `unmock.pt.succeeds`, `unmock.pt.nice` and `unmock.pt.chaos`.

### Failure

Wrapping part of a test in `unmock.pt.fails` will explore different configurations of failure for a given API call.  For example, let's say that we assume that when `updatesName` fails, its error will contain a field called `message` and this field will always be a `string`.

```ts
// updatesName.ts
const updatesName = async (id: string, name: string) => {
  try {
    const res = await updateProfile({ id, name });
    sendAnalyticsEvent(PROFILE_UPDATED, { id });
    const { id, name, avatar, location, ...rest } = res;
    return { id, name, avatar, location };
  } catch (e) {
    return e.message;
  }
}
```

```ts
// updatesName.test.ts
test("tests name update failure" => () {
  unmock.pt.fails(async () => {
    const res = updatesNicknameAPI('bob');
    expect(typeof res).toBe("string");
  });
});
```

When we run our test, we may get the following result.

```bash
***************************************************
unmock: "tests name update failure" failed on the following configurations:
- EADDRNOTAVAIL.
  undefined is not string
- 501.
  undefined is not string
and succeeded on:
- 400
- 403
- 500.
***************************************************
```

We can now test just these specific points of failure to drill to the bottom of the problem.

```ts
// updatesName.test.ts
test("tests name update failure" => async () {
  unmock.pt.fails(['EADDRNOTAVAIL', 501], async () => {
    const res = await updatesNicknameAPI('bob');
    expect(typeof res).toBe("string");
  });
});
```

### Success

Similarly to the failure scenario, unmock can also test only successful outcomes.

```ts
// updatesName.test.ts
test("tests name update success" => async () {
  unmock.pt.succeeds(async () => {
    const res = await updatesNicknameAPI('bob');
    expect(Object.keys(res)).toBe(['id','name','avatar','location']);
  });
});
```

```bash
***************************************************
unmock: "tests name update success" failed on the following configurations:
- { id: 'a' }
  undefined is not string
- { id: 'a', name: 'bob' }
and succeeded on:
- { id: 'a', name: 'bob', avatar: 'avatar.com/bob.png', location: 'Paris' }
- { id: 'b', name: 'bob', avatar: 'avatar.com/bob.png', location: 'Paris' }
***************************************************
```

Great! We found that our test fails because our API can, contrary to our expectations, return an object with the name, avatar, and location field blank. We can tweak our code to account for these scenarios.

### Nice

In certain cases, it is good to simulate APIs returning any valid response. Or, in other words, the API behaves "nicely," meaning that even when it fails, it fails the way it is expected to fail. This is especially useful when success and failure should lead to the same outcome. For example, if you are posting information to a non-critical API that has no bearing on UX, you may want to simultaneously test success and failure.

If you look at the function `updateName` again, you'll notice that there is a call to `sendAnalyticsEvent`. Let's allow it to return any valid response.  Here, we also see a nifty feature of `unmock.pt` - the ability to specify a given API, just like the `states` object.

```ts
// updatesName.test.ts
test("tests name update does not crash because of analytics api" => () {
  unmock.pt.nice.analytics(async () => {
    await updatesNicknameAPI('bob');
  });
});
```

### Chaos

In some (unfortnately not so) rare circumstances, an API will be so erratic that you cannot trust it to behave correctly. In this case, [Chaos isn't a pit. Chaos is a ladder.](https://www.youtube.com/watch?v=iRS8a8HjqFs) While there are many chaos testing libraries available, `unmock.pt.chaos` introduces a modicum of chaos only for a specific API call, returning *anything* (wrong content length, wrong body structure, etc.). In general, `chaos` is your friend if you want to make sure that part of your code base is resilient.

```ts
// updatesName.test.ts
test("tests name update does not crash because of flaky analytics API" => () {
  unmock.pt.chaos.analytics(async () => {
    await updatesNicknameAPI('bob');
  });
});
```

### Composition

Sometimes, you will want your property testing to compose various different behaviors. For exmaple, API A will always fail whereas API B will always succeed. To achieve this, you can use `unmock.pt.compose`.

```ts
// updatesName.test.ts
test("tests name update does not crash because of flaky analytics API" => () {
  unmock.pt.compose(unmock.pt.success.apiB(), unmock.pt.failure.apiA(), async () => {
    myFunction();
  });
});
```

## Unmock and `fast-check`

[`fast-check`](https://www.npmjs.com/package/fast-check) is a popular JavaScript property testing library. `unmock` is interoperable with `fast-check`.

Let's consider the following example from the `fast-check` documentation.

```js
const fc = require('fast-check');
 
// Code under test
const contains = (text, pattern) => text.indexOf(pattern) >= 0;
 
// Properties
describe('properties', () => {
  // string text always contains itself
  it('should always contain itself', () => {
    fc.assert(fc.property(fc.string(), text => contains(text, text)));
  });
  // string a + b + c always contains b, whatever the values of a, b and c
  it('should always contain its substrings', () => {
    fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a,b,c) => contains(a+b+c, b)));
  });
});
```

Imagine that, instead of using `text.indexOf`, we use the website `index-of.io` to do the same thing.

```js
const axios = require('axios');
const fc = require('fast-check');
 
// Code under test
const contains = async (text, pattern) => {
  try {
    const { data } = await axios('https://index-of.io/'+text);
    return data;
  } catch {
    return -1;
  }
}
 
// Properties
describe('properties', () => {
  // string text always contains itself
  it('should always contain itself', () => {
    fc.assert(fc.property(unmock.pt.success(), fc.string(), text => contains(text, text)));
  });
  // contains returns false when API is broken
  it('should always contain its substrings', () => {
    fc.assert(fc.property(unmock.pt.failure(), fc.string(), text => contains(text, text) == -1));
  });
});
```

You'll see that, in the examples above, `unmock.pt.X()` does not inject anything into the `fast-check` function, but rather instructs unmock to behave a certain way in the context of a test. This can also be useful for composing functions - for example, when you want to test a certain API fails whereas another one succeeds.  The astute reader will note that this is the same as [`unmock.pt.compose`](#composition).

```ts
// Properties
describe('properties', () => {
  // string text always contains itself
  it('should always contain itself', () => {
    fc.assert(fc.property(unmock.pt.success.api0(), unmock.pt.chaos.api1(), fc.string(), text => foo(text)));
  });
});
```