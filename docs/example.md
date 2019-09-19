---
id: example
title: A Motivating Example
sidebar_label: A Motivating Example
---

Below is a fully functional example of Unmock in action! You can also run it live [here](https://www.foo.bar) and inspect its output results [here](https://www.output-resuts.com). It shows the most important concepts of Unmock all rolled into one example.

The example will use TypeScript syntax, although the same is possible in JavaScript. First, let's import everything we need.

```ts
import unmock, { runner, u, transform } from "unmock";
import axios from "axios";
const { withCodes, withoutCodes } = transform;
```

Then, let's write a function that fetches a horoscope from our fictional horoscope API and transforms it into a human-readable string.

```ts
const getHoroscope = async (user: string) => {
  try {
    const { data } = await axios("https://zodiac.com/horoscope/" + user);
    return `Here's your horoscope, ${data.user} of the Great and Mighty sign ${data.sign}. ${data.horoscope}.`;
  } catch (e) {
    return `Sorry, your stars are not aligned today :-(`;
  }
};
```

Because our service does not exist yet, we need to (un)mock it!

```ts
unmock
  .nock("https://zodiac.com", "zodiac")
  .get("/horoscope/{user}")
  .reply(200, {
    id: u.integer(),
    name: u.string("name.firstName"),
    sign: u.string(),
    ascendant: u.string(),
    type: "horoscope",
  })
  .get("/horoscope/{user}")
  .reply(404, { message: "Not authorized." });
```

Here, there are two possible outcomes: `200`, which is success, and `404`, which is an authorization failure. Let's write three tests using [Jest](https://jestjs.io).

```ts
let zodiac: Service;

beforeAll(() => {
  zodiac = unmock.on().services.zodiac;
});

beforeEach(() => zodiac.reset());

afterEach(() => zodiac.spy.resetHistory());

test(
  "call to the horoscope service uses the username",
  runner(async () => {
    zodiac.state(withCodes(200));
    await getHoroscope("jane");
    const requestPath = zodiac.spy.getRequestPath();
    expect(requestPath).toBe(`/horoscope/jane`);
    zodiac.spy.resetHistory();
  })
);

test(
  "horoscope does not result in unexpected error when resposne is 200",
  runner(async () => {
    zodiac.state(withCodes(200));
    const horoscope = await getHoroscope("jane");
    const responseBody = JSON.parse(zodiac.spy.getResponseBody());
    expect(horoscope).toBe(
      `Here's your horoscope, ${responseBody.user} of the Great and Mighty sign ${responseBody.sign}. ${responseBody.horoscope}.`
    );
    zodiac.spy.resetHistory();
  })
);

test(
  "when the response is not 200, the only outcome is an error",
  runner(async () => {
    zodiac.state(withoutCodes(200));
    const horoscope = await getHoroscope("jane");
    if (zodiac.spy.getResponseCode() !== 200) {
      expect(horoscope).toBe(`Sorry, your stars are not aligned today :-(`);
    }
    zodiac.spy.resetHistory();
  })
);
```

In addition to writing tests, it would make us more confident that our code works as expected if we could see the network traffic of our tests in realtime. The [Jest reporter](/reporter) exists for this reason, and an example of the reporter used with the example above lives [here](https://www.foo.com).

Examples like the one above show how Unmock helps answer several essential questions.

1. **Request Verification**: Does my code correctly compose the input for network calls?
1. **Response Verification**: Does my code correctly handle the output of network calls?
1. **Fuzz Testing**: Does my code work as expected even when the behavior of the API varies subtly?

Before looking at these questions in detail, it's important to understand how services are defined in Unmock.
