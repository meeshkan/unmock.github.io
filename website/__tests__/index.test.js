import Index from "../pages/en/index";
import * as React from "react";
import { shallow } from "enzyme";

const siteConfig = {
  baseUrl: "/url",
};

describe("Rendering index", () => {
  it("does not throw on shallow render", () => {
    expect(() => shallow(<Index config={siteConfig} />)).not.toThrow();
  });
});
