import { describe, it, expect, vi } from "vitest";
import sitemapFn from "../../app/sitemap.js";
import { SITE_URL } from "../config/site.js";

describe("sitemap", () => {
  const entries = sitemapFn();

  it("returns 7 entries", () => {
    expect(entries).toHaveLength(7);
  });

  it("first entry is the homepage with priority 1.0", () => {
    expect(entries[0].url).toBe(SITE_URL);
    expect(entries[0].priority).toBe(1.0);
  });

  it("every entry has a url string and numeric priority", () => {
    entries.forEach((e) => {
      expect(typeof e.url).toBe("string");
      expect(e.url.length).toBeGreaterThan(0);
      expect(typeof e.priority).toBe("number");
    });
  });

  it("uses valid per-page modification dates that stay stable across builds", () => {
    const dates = entries.map(({ lastModified }) => lastModified.toISOString());
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2030-01-01"));
      expect(sitemapFn().map(({ lastModified }) => lastModified.toISOString())).toEqual(dates);
    } finally {
      vi.useRealTimers();
    }
  });
});
