---
id: introduction
title: A Simple Example
sidebar_label: A Simple Example
---

Here's an example of several different features in Unmock.  While it is slightly longer than your typical "Hello World", it shows several useful features of Unmock all rolled into one example.

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
  const { myapi } = unmock.on();
  /* property testing */
  compose(myapi.succeeds(), [u.int], async (expt, id) => {
    const user = await userAsUIObject(id);
    expt(myapi.spy).getPath("https://www.myapi.com/users/"+id);
    /* output verification */
    expt(user).toMatchObject(myapi.getResponseBody());
    /* passthrough validation */
    expt.postOnce("https://log.io", { id });
    expt(user.welcomeMessage).toBe(`Hello ${user.name}!`)
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

1. [**IO Verification**](expectations.md): Does my code correctly compose the input and transform the output of network calls?
2. [**Property Testing**](property.md): Does my code account for all the ways an external API or my network connection may behave?
3. [**Passthrough Validation**](passthrough.md): Does my code trigger the correct passthrough integrations, like analytics, logging, etc?

Before looking at these questions in detail, it's important to understand how services are defined in Unmock.