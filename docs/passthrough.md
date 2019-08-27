---
id: passthrough
title: Those "Boring" API Calls
sidebar_label: Those "Boring" API Calls
---

Remember when Bob was in the company and made a bunch of APIs that aggregated data for analytics? You know, stuff like `user-activity-index` and `geo-hot-spots` and other microservices that are called from the code base you inherited?  There's a rumor that someone somewhere finds them useful, and they don't break anything, but you don't want to be bothered by them.

At Unmock, we call Bob's APIs "boring" API calls. They just kind of hang out, like Bob when worked at the company. They are harmless and possibly even helpful.

Boring API calls pose a challenge to integration testing because we don't really care about them, but we can't just ignore them, as that would break our tests. Unmock proposes a compromise called *passthrough validation* - **don't** define any specification for these APIs, but **do** assert that they exist.  That way, you are telling other coders "hey, I acknowledge that this is here, but I'm not doing anything about it.

## Passthrough validation

Passthrough validation is done with `unmock.passthrough`. It *only* needs to assert that an API was called.


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
  compose(myapi.succeeds(), [u.int], async (expt, id) => {
    unmock.passthrough("https://bobsapi.com/report");
    const user = await userAsUIObject(id);
    expt(myapi).getPath("https://www.example.com/api/users/"+id);
    expt(user).toMatchObject(myapi.getResponseBody());
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
  try {
      await axios.post("https://bobsapi.com/report", { touched: id});
  } catch {
      // no clue what this does...
  }
  return {
    ...data,
    seen: false,
    edited: false,
  }
}
export default userAsUIObject;
```

<!--END_DOCUSAURUS_CODE_TABS-->

Passthrough is meant to be intentionally kludgy and lazy. If you need to make more specific assertions about a passthrough API, you should probably be using a *bona fide* specification.