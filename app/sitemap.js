import { SITE_URL } from "@/config/site";

export default function sitemap() {
  // Update each page's date for significant content or metadata changes.
  // Keep dates stable across builds and cosmetic edits; shared content changes
  // can affect several pages. These dates describe the content being deployed.
  return [
    { url: SITE_URL, lastModified: new Date("2026-11-15"), changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/portfolio`, lastModified: new Date("2026-11-15"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/betterhr`, lastModified: new Date("2026-11-15"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/kbz-bank`, lastModified: new Date("2026-11-24"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/unilinks`, lastModified: new Date("2026-11-24"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/wct`, lastModified: new Date("2026-11-15"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact-me`, lastModified: new Date("2026-11-24"), changeFrequency: "monthly", priority: 0.7 },
  ];
}
