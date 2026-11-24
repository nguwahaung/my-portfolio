"use client";

import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaseStudyAuthor } from "@/components/CaseStudyAuthor";
import {
  textPrimary,
  textSecondary,
  bgPage,
  pageTransition,
  scrollReveal,
  CASE_STUDY_HERO_IMAGE_SIZES,
} from "@/config/caseStudy";

export function CaseStudyShell({ coverImage, title, tags, liveUrl, thumbnail, children }) {
  return (
    <Reveal
      entrance
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={pageTransition}
      className="focus-reveal min-h-screen relative"
      style={{ backgroundColor: bgPage }}
    >
      <Header />

      {/* Hero: fixed background image at top (does not scroll).
          will-change promotes this to its own compositor layer so the
          browser doesn't repaint it on every scroll frame. */}
      <div
        className="fixed top-0 left-0 right-0 h-[30vh] z-0"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        <div className="relative h-full w-full">
          <Image
            src={coverImage}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Hero content and page content scroll over the fixed image */}
      <section className="relative flex flex-col z-10 mt-28 min-h-[50vh]">
        <Reveal
          entrance
          {...scrollReveal}
          className="focus-reveal max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-14 w-full bg-white rounded-t-2xl pt-10"
        >
          <h1
            className="text-4xl md:text-5xl px-4 font-medium text-center leading-tight mb-6 pt-5 tracking-tight"
            style={{ color: textPrimary }}
          >
            {title}
          </h1>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {tags.map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium"
                style={{ color: textPrimary }}
              >
                {icon}
                {label}
              </span>
            ))}
          </div>
          <div className="flex justify-center mt-8 mb-4">
            <Button
              size="lg"
              className="rounded-full text-white font-medium px-8"
              asChild
            >
              <a
                href={liveUrl}
                target="_blank"
                aria-label="Live Project"
                rel="noopener noreferrer"
              >
                <span>Live Project</span>
                <ExternalLink className="size-5" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <Reveal entrance {...scrollReveal} className="mt-10">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={thumbnail.src}
                alt={`${title}, desktop and mobile interface preview`}
                width={thumbnail.width}
                height={thumbnail.height}
                sizes={CASE_STUDY_HERO_IMAGE_SIZES}
                className="w-full h-auto"
              />
            </div>
          </Reveal>
        </Reveal>
        <main
          id="main-content"
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 py-12 tracking-tight rounded-b-2xl bg-white"
          style={{ color: textSecondary }}
        >
          {children}
          <CaseStudyAuthor />
        </main>
      </section>

      <Reveal
        {...scrollReveal}
        className="focus-reveal"
      >
        <Footer />
      </Reveal>
    </Reveal>
  );
}
