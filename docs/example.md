---
id: example
title: A Simple Example
sidebar_label: A Simple Example
---

Here's an example of several different features in Unmock. While it is slightly longer than your typical "Hello World", it shows several useful features of Unmock all rolled into one example.

<!--DOCUSAURUS_CODE_TABS-->

<!--Test-->

```javascript
// userAsUIObject.test.js

import unmock from "unmock-node";
import userAsUIObject from "./userAsUIObject";

describe("user from backend", () => {
  let myapi;
  beforeAll(() => {
    myapi = unmock.on().services.myapi;
  });
  afterAll(() => {
    unmock.off();
  });

  test("should be correct as UI object", async () => {
    const user = await userAsUIObject(id);
    /* Request verification */
    expect(myapi.spy.getPath()).toBe("https:/api.myapi.com/users/" + id);
    /* Output verification */
    expect(user).toMatchObject(myapi.getResponseBody());
    /* Output verification on fake data */
    expect(user.welcomeMessage).toBe(`Hello ${user.name}!`);
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
const userAsUIObject = async id => {
  const { data: user } = await axios("https://api.myapi.com/users/" + id);
  return {
    ...user,
    seen: false,
    edited: false,
    welcomeMessage: `Hello ${user.name}!`,
  };
};
export default userAsUIObject;
```

<!--YAML-->

```yaml
// __unmock__/myapi/openapi.yaml
// Service specification for myapi

openapi: 3.0.0
info:
  version: "1.0"
  title: "myapi"

paths:
  /users/{id}:
    parameters:
      - name: id
        in: path
        description: User ID
        required: true
        schema:
          type: integer
          format: int32
    get:
      responses:
        "200":
          description: "User"
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                  - age
                  - type
                properties:
                  id:
                    type: number
                    format: int32
                  name:
                    type: string
                  age:
                    type: number
                  type:
                    type: string
                    default: "user"
```

<!--END_DOCUSAURUS_CODE_TABS-->

Examples like the one above show how Unmock helps answer two essential questions.

1. **Request Verification**: Does my code correctly compose the input for network calls?
2. **Response Verification**: Does my code correctly handle the output of network calls?

Before looking at these questions in detail, it's important to understand how services are defined in Unmock.
