---
id: property
title: Property Testing
sidebar_label: Property Testing
---

Property testing is the preferred way to use Unmock. Unless you are sure an API will always return one and only one response (which is almost never the case), you should use proprety testing.  We've already seen property testing in the [simple example](introduction.md) - all it requires is wrapping your test in `unmock.compose`.

Under the hood, property testing runs the same test multiple times with different outcomes. For example, if a field is optional in an API response body, a property test may omit it and then include it.  This is a lean and fast way to make sure your API integrations are resilient.

## Outcomes

Property testing in Unmock is always linked to services - `github`, `myapi`, or whatever services you have defined in the `unmock.services` object. There are four different verbs that describe how each API can behave in a property test: `fails`, `succeeds`, `behaves`, and `panics`.  So, in property testing, you write things like `github.fails`, `myapi.succeeds`, `slack.behaves` and `stripe.panics`.

### Failure

User `service.fails` to explore different configurations of failure for a given API call.  Unmock will return any defined `400` responses plus a variety of `500` responses and everyone's favorite `EADDRNOTAVAIL`.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.test.js

import unmock, { compose, u } from "unmock";
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
  stack = unmock.on();
  const { myapi } = stack;
  compose(myapi.fails(), [u.int], async (id) => { /* property testing */
    expect(async () => {
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

import unmock, { compose, u } from "unmock";
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
  stack = unmock.on();
  const { myapi } = stack;
  compose(myapi.succeeds(), [u.int], async (id) => {
    const user = await userAsUIObject(id);
    stack(expect).getOnce("https://www.example.com/api/users/"+id);
    const { body } = myapi.response;
    stack(expect)(user).toExtend(body));
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

import unmock, { compose, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.horoscope.com")
  .get("/{sign}")
  .reply(200, {
    horoscpe: u.zodiac.horoscope,
  });

test("user from backend is correct as UI object", async () => {
  stack = unmock.on();
  const { horoscope } = stack;
  compose(horoscope.behaves(), [u.string], async (sign) => {
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

import unmock, { compose, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.horoscope.com")
  .get("/{sign}")
  .reply(200, {
    horoscpe: u.zodiac.horoscope,
  });

test("user from backend is correct as UI object", async () => {
  stack = unmock.on();
  const { horoscope } = stack;
  compose(horoscope.panic(), [u.string], async (sign) => {
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

## Composition

We have seen the function `unmock.compose` used to control property testing for single APIs, but it can compose as many APIs as you throw at it. Simply pass an array of behaviors instead of a single one and unmock will compose them together in a single test.

## Unmock and `fast-check`

[`fast-check`](https://www.npmjs.com/package/fast-check) is a popular JavaScript property testing library. `unmock` is interoperable with `fast-check`.  Simply wrap an `unmock.compose` call in a fast-check call or vice versa to combine the two tools.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.test.js

import unmock, { compose, u } from "unmock";
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
  stack = unmock.on();
  const { myapi } = stack;
  compose(myapi.succeeds(), async () => {
    fc.assert(fc.property(fc.number(), async (id) => {
      const user = await userAsUIObject(id);
      stack(expect).getOnce("https://www.example.com/api/users/"+id);
      const { body } = myapi.response;
      return body === user.fromAPI;
    }));
  });
});
```

<!--Code-->
```javascript
// userAsUIObject.js
const userAsUIObject = async (id) => {
  const { data } = await axios("https://www.example.com/api/users/"+id);
  return {
    fromAPI: data,
    seen: false,
    edited: false,
  }
}
export default userAsUIObject;
```

<!--END_DOCUSAURUS_CODE_TABS-->