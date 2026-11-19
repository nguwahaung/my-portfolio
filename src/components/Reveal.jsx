"use client";

import { useContext, useEffect, useRef } from "react";
import { motion, MotionConfigContext } from "framer-motion";
import { cn } from "@/lib/utils";

const elements = {
  div: motion.div,
  article: motion.article,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  header: motion.header,
  form: motion.form,
};

// The standard section reveal: fade up by `y` pixels once, when scrolled into view.
export const fadeUp = (y) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

// A page introduction must start at first paint, not hide SSR content at hydration.
// Native elements also keep Motion from replaying an inherited variant later.
function PaintReveal({
  as: Component = "div", entrance, initial = {}, animate, whileInView, variants,
  viewport, className, transition, style, ...props
}) {
  const ref = useRef(null);
  const margin = viewport?.margin;

  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let observer;
    const complete = () => {
      delete element.dataset.entranceWaiting;
      element.dataset.entranceComplete = "true";
      observer?.disconnect();
    };
    const onPreferenceChange = (event) => {
      if (event.matches) complete();
    };
    const onAnimationEnd = (event) => {
      if (event.target === element) complete();
    };
    media?.addEventListener("change", onPreferenceChange);
    element.addEventListener("animationend", onAnimationEnd);

    if (media?.matches) {
      complete();
    } else if (window.IntersectionObserver) {
      const bounds = element.getBoundingClientRect();
      if (bounds.top >= window.innerHeight) {
        // Arm only offscreen content. Visible introductions never reset at hydration.
        delete element.dataset.entranceComplete;
        element.dataset.entranceWaiting = "true";
        observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          delete element.dataset.entranceWaiting;
          observer.disconnect();
        }, { rootMargin: margin });
        observer.observe(element);
      } else if (element.getAnimations?.().every((animation) => animation.playState === "finished")) {
        // The CSS entrance may already have finished before React became ready.
        complete();
      }
    }

    return () => {
      observer?.disconnect();
      media?.removeEventListener("change", onPreferenceChange);
      element.removeEventListener("animationend", onAnimationEnd);
    };
  }, [margin]);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn("paint-reveal", className)}
      style={{
        ...style,
        "--entrance-opacity": initial.opacity ?? 1,
        "--entrance-y": `${initial.y ?? 0}px`,
        "--entrance-scale": initial.scale ?? 1,
        "--entrance-duration": `${transition?.duration ?? 0.5}s`,
        "--entrance-delay": `${transition?.delay ?? 0}s`,
      }}
    />
  );
}

function ScrollReveal({ as = "div", entrance = false, className, transition, ...props }) {
  const ref = useRef(null);
  const { transition: defaults } = useContext(MotionConfigContext);
  const Component = elements[as];

  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const bounds = ref.current.getBoundingClientRect();
    // Keep already-visible content readable unless its introduction is intentional.
    if (entrance || bounds.top >= window.innerHeight || bounds.bottom <= 0) {
      ref.current.dataset.revealReady = "true";
    }
  }, [entrance]);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn("scroll-reveal", className)}
      transition={{ ...defaults, ...transition }}
    />
  );
}

export function Reveal(props) {
  return props.entrance === "paint" ? <PaintReveal {...props} /> : <ScrollReveal {...props} />;
}
