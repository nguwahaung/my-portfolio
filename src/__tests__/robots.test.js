import { describe, it, expect } from "vitest";
import robotsFn from "../../app/robots.js";

describe("robots", () => {
  const config = robotsFn();

  it("has one rule allowing all crawlers to access /", () => {
    expect(config.rules[0].userAgent).toBe("*");
    expect(config.rules[0].allow).toBe("/");
  });
});
