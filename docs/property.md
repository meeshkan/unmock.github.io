---
id: property
title: Property Testing
sidebar_label: Property Testing
---

Property testing is the preferred way to use Unmock. Unless you are sure an API will always return one and only one response (which is almost never the case), you should use proprety testing.  We've already seen property testing in the [simple example](introduction.md) - all it requires is wrapping your test in `unmock.check`.

Under the hood, property testing runs the same test multiple times with different outcomes. For example, if a field is optional in an API response body, a property test may omit it and then include it.  This is a lean and fast way to make sure your API integrations are resilient.

## Outcomes

Property testing in Unmock is always linked to services - `github`, `myapi`, or whatever services you have defined in the `unmock.services` object. There are four different verbs that describe how each API can behave in a property test: `fails`, `succeeds`, `behaves`, and `panics`.  So, in property testing, you write things like `github.fails`, `myapi.succeeds`, `slack.behaves` and `stripe.panics`.

The anatomy of a property test is always the same: `check` followed by an array of statements in the form `<api>.<verb>` followed by an optional array of input values followed by a function with the code to test. This function **always** has an expectation object as a first argument (ie `jest.expect` or `mocha.expect` depending on your test runner). You use this, instead of `expect` in Jest or Mocha, to make sure every property test executes.  Here is a simple example.

```javascript
check([github.fails(), myapi.succeeds()], [u.random.number], (expt, id) => {
  const res = await myfunction(id);
  // don't use expect here! it won't work. use the first argument
  // to the function above. as a convention, we call it expt.
  expt(res).toEqual({ foo: { bar: "baz" }});
});
```

If there is only one verb (ie only `github.fails`), the array can be replaced with just that statement. Furthermore, the second array is optional - if you have no arguments that need to be randomly generated, you can skip it.

```javascript
check([github.fails(), myapi.succeeds()], (expt) => {
  const res = await myfunction();
  expt(res).toEqual({ foo: { bar: "baz" }});
});
```

### Failure

User `service.fails` to explore different configurations of failure for a given API call.  Unmock will return any defined `400` responses plus a variety of `500` responses and everyone's favorite `EADDRNOTAVAIL`.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.test.js

import unmock, { check, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.id, // uses `id` from the path
    name: u.name., // generates a fake name
    age: u.$.age., // optionally generates a fake age
    type: 'user', // the literal word "user"
  });

test("user from backend is correct as UI object", async () => {
  const { myapi } = unmock.on().services;
  check(myapi.fails(), [u.int], async (expt, id) => { /* property testing */
    expt(async () => {
      await userAsUIObject(id);
    }).toThrow();
  });
});
```

<!--Code-->
```javascript
// userAsUIObject.js
/*
  In this file, we make a call to our API and enrich the object
  with some client-side fields for representing the user in the UI.
*/
const userAsUIObject = async (id) => {
  const { data } = await axios("https://www.example.com/api/users/"+id);
  return {
    ...data,
    seen: false,
    edited: false,
  }
}
export default userAsUIObject;
```

<!--END_DOCUSAURUS_CODE_TABS-->

### Success

Similarly to the failure scenario, unmock can also test only successful outcomes.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.test.js

import unmock, { check, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.myapi.com")
  .get("/users/{id}")
  .reply(200, {
    id: u._.id, // uses `id` from the path
    name: u.name., // generates a fake name
    age: u.$.age., // optionally generates a fake age
    type: 'user', // the literal word "user"
  });

test("user from backend is correct as UI object", async () => {
  const { myapi } = unmock.on().services;
  check(myapi.succeeds(), [u.int], async (expt, id) => {
    const user = await userAsUIObject(id);
    expt(myapi.spy.getPath()).toBe("https://www.myapi.com/users/"+id);
    expt(user).toMatchObject(myapi.spy.getResponseBody());
  });
});
```

<!--Code-->
```javascript
// userAsUIObject.js
/*
  In this file, we make a call to our API and enrich the object
  with some client-side fields for representing the user in the UI.
*/
const userAsUIObject = async (id) => {
  const { data } = await axios("https://www.example.com/api/users/"+id);
  return {
    ...data,
    seen: false,
    edited: false,
  }
}
export default userAsUIObject;
```

<!--END_DOCUSAURUS_CODE_TABS-->


### Behaves

The `behaves` command will test out a variety of valid responses, including success and failure. As success and failure normally respond in different code paths, this test should only be used on functions that convert errors to default values.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// horoscope.test.js

import unmock, { check, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.horoscope.com")
  .get("/{sign}")
  .reply(200, {
    horoscpe: u.zodiac.horoscope,
  });

test("user from backend is correct as UI object", async () => {
  const { horoscope } = unmock.on().services;
  check(horoscope.behaves(), [u.string], async (sign) => {
    const prediction = await getHoroscope(sign);
    expect(typeof prediction).toBe("string");
  });
});
```

<!--Code-->
```javascript
// horoscope.js

const getHoroscope = async (sign) => {
  try {
    const { data: { horoscope } } = await axios("https://www.horoscope.com/"+sign);
    return horoscope;
  } catch {
    return "Your internet connection will experience problems."
  }
}
export default getHoroscope;
```

<!--END_DOCUSAURUS_CODE_TABS-->

### Panic!

When Unmock panics, it literally responds with *anything*. Random bytes, cat pictures, JSON intercepted from NASA communications. You name it, we'll use it.  This is a great way to stress test your integrations!

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// horoscope.test.js

import unmock, { check, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.horoscope.com")
  .get("/{sign}")
  .reply(200, {
    horoscpe: u.zodiac.horoscope,
  });

test("user from backend is correct as UI object", async () => {
  const { horoscope } = unmock.on().services;
  check(horoscope.panic(), [u.string], async (sign) => {
    const prediction = await getHoroscope(sign);
    expect(typeof prediction).toBe("string");
  });
});
```

<!--Code-->
```javascript
// horoscope.js

const getHoroscope = async (sign) => {
  try {
    const { data: { horoscope } } = await axios("https://www.horoscope.com/"+sign);
    return horoscope;
  } catch {
    return "Your internet connection will experience problems."
  }
}
export default getHoroscope;
```

<!--END_DOCUSAURUS_CODE_TABS-->
