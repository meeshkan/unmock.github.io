---
id: introduction
title: A Simple Example
sidebar_label: A Simple Example
---

Here's an example of several different features in Unmock.  While it is slightly longer than a "Hello World", it shows several useful features of Unmock all rolled into one example.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->
```javascript
// userAsUIObject.js

import unmock, { compose, u } from "unmock";
import userAsUIObject from "./userAsUIObject";

unmock("https://www.myapi.com/users/{id}")
  .serve({
    id: u._.id, // uses `id` from the path
    name: u.name., // generates a fake name
    age: u.$.age., // optionally generates a fake age
    type: 'user', // the literal word "user"
  });

test("user from backend is correct as UI object", async () => {
  stack = unmock.on();
  const { myapi } = stack;
  compose(myapi.success(), [u.int], async (id) => { /* property testing */
    const user = await userAsUIObject(id);
    stack(expect).getOnce("https://www.example.com/api/users/"+id);
    const { body } = myapi.response;
    stack(expect)(user).toExtend(body)); /* output verification */
    stack(expect).postOnce("https://log.io", { id }); /* passthrough validation */
    stack(expect)(user.welcomeMessage).toBe(`Hello ${user.name}!`)
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

Examples like the one above show how Unmock helps answer three essential questions.

1. **Output Verification**: Does my code correctly compose the input and transform the output of network calls?
2. **Property Testing**: Does my code account for all the ways an external API or my network connection may behave?
3. **Passthrough Validation**: Does my code trigger the correct passthrough integrations, like analytics, logging, etc?

This documentation covers these questions in three separate sections.

You'll also learn about Unmock's different methods for simulating external APIs (like Stripe or another microservice in your company) and the various test reports Unmock can produce.