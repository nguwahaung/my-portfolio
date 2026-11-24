import Image from "next/image";
import { SITE, SOCIAL_LINKS } from "@/config/site";
import { PROFILE_IMAGE } from "@/config/assets";

const socialLinks = [
  {
    label: "Facebook",
    href: SOCIAL_LINKS.facebook,
    path: "M13 22v-8h3l1-4h-4V8c0-1.03 0-2 2-2h2V2h-3c-3.6 0-5 1.79-5 5v3H6v4h3v8h4z",
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z",
  },
];

export function CaseStudyAuthor() {
  return (
    <div className="border-t border-gray-200 py-4 mx-4">
      <div className="flex flex-col items-start gap-4 mt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <Image
            src={PROFILE_IMAGE}
            alt={SITE.displayName}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <h3 className="text-base text-gray-900">{SITE.displayName}</h3>
            <p className="text-sm text-gray-500">{SITE.tagline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {socialLinks.map(({ label, href, path }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-slate-500 shadow-xs transition hover:text-slate-600 focus-visible:text-slate-600 focus-visible:outline-2"
              aria-label={label}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d={path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
