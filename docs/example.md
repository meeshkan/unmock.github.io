---
id: example
title: A Motivating Example
sidebar_label: A Motivating Example
---

Below is a fully functional example of unmock in action! You can also run it live [here](https://www.foo.bar) and inspect it's output results [here](https://www.output-resuts.com). It shows the most important concepts of all unmock all rolled into one example.

The example will use typescript syntax, although the same is possible in JavaScript.  First, let's import everything we need.

```ts
import unmock, { u, transform } from "unmock";
import axios from "axios";
const { withCodes, withoutCodes } = transform;
```

Then, let's write a function that fetches a horoscope from our fictional horoscope API and transforms it into a human-readable string.

```ts
const getHoroscope = async (user: string) => {
  try {
    const { data } = axios("https://zodiac.com/horoscope/"+user);
    return `Here's your horoscope, ${data.user} of the Great and Mighty sign ${data.sign}. ${data.horoscope}.`;
  } catch (e) {
    return `Sorry, your stars are not aligned today :-(`;
  }
};
```

Because our service does not exist yet, we need to (un)mock it!

```ts
unmock.
  nock("https://zodiac.com", "zodiac")
  .get("/horoscope/{user}")
  .reply(200, {
    id: u.integer(),
    name: u.string("name.firstName"),
    sign: u.string(),
    ascendant: u.name(),
    type: "horoscope"
  })
  .get("/horoscope/{user}")
  reply(404, { message: "Not authorized." })
```

Here, there are two possible outcomes: `200`, which is success, and `404`, which is an authorization failure. Let's write three tests using [Jest](https://jestjs.io).

```ts
let zodiac;
beforeAll(() => {
  zodiac = unmock.on().services.zodiac;
});
beforeEach(() => zodiac.reset())

test("call to the horoscope service uses the username", runner(async () => {
  horoscope(withCodes(200));
  const horoscope = await getHoroscope("jane");
  const spy = zodiac.spy.getRequestPath();
  expect(requestPath.split("/").slice(-1)).toBe(`jane`);
  spy.resetHistory();
}));

test("horoscope does not result in unexpected error when resposne is 200", runner(async () => {
  horoscope(withCodes(200));
  const horoscope = await getHoroscope("jane");
  const spy = zodiac.spy.getResponseBody();
  expect(horoscope).toBe(`Here's your horoscope, ${spy.user} of the Great and Mighty sign ${spy.sign}. ${spy.horoscope}.`);
  spy.resetHistory();
}));

test("when the response is not 200, the only outcome is an error", runner(async () => {
  horoscope(withoutCodes(200));
  const horoscope = await getHoroscope("jane");
  const spy = zodiac.spy.getResponseBody();
  if (spy.getStatusCode() !== 200) {
    expect(horoscope).toBe(`Sorry, your stars are not aligned today :-(`);
  }
  spy.resetHistory();
}));

```

In addition to writing tests, it would make us more confident that our code works as expected if we could see the network traffic of our tests in realtime. The [jest reporter](/reporter) exists for this reason, and an example of the reporter used with the example above lives [here](https://www.foo.com).

Examples like the one above show how Unmock helps answer several essential questions.

1. **Request Verification**: Does my code correctly compose the input for network calls?
1. **Response Verification**: Does my code correctly handle the output of network calls?
1y. **Fuzz Testing**: Does my code work as expected even when the behavior of the API varies subtly.

Before looking at these questions in detail, it's important to understand how services are defined in Unmock.
