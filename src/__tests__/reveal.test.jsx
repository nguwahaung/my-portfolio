import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Reveal } from "../components/Reveal";
import { MockIntersectionObserver } from "./test-utils/mocks";

const offscreenBelow = () => ({ top: window.innerHeight + 100, bottom: window.innerHeight + 200 });
const offscreenAbove = () => ({ top: -200, bottom: -100 });
const onscreen = () => ({ top: 100, bottom: 200 });

function mockBounds(bounds) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(bounds());
}

describe("Reveal", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    ["below", offscreenBelow],
    ["above", offscreenAbove],
  ])("enables the entrance effect for content %s the viewport", (_, bounds) => {
    mockBounds(bounds);
    render(<Reveal>content</Reveal>);
    expect(screen.getByText("content")).toHaveAttribute("data-reveal-ready", "true");
  });

  it("keeps content that is already on screen readable instead of hiding it", () => {
    mockBounds(onscreen);
    render(<Reveal>content</Reveal>);
    expect(screen.getByText("content")).not.toHaveAttribute("data-reveal-ready");
  });

  it("enables an intentional entrance for content that is already on screen", () => {
    mockBounds(onscreen);
    render(<Reveal entrance>content</Reveal>);
    expect(screen.getByText("content")).toHaveAttribute("data-reveal-ready", "true");
  });

  it("never enables the effect without IntersectionObserver, even for an entrance", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mockBounds(offscreenBelow);
    render(<Reveal entrance>content</Reveal>);
    expect(screen.getByText("content")).not.toHaveAttribute("data-reveal-ready");
  });

  it("keeps the scroll-reveal class beside the caller's classes", () => {
    render(<Reveal className="mt-10">content</Reveal>);
    expect(screen.getByText("content")).toHaveClass("scroll-reveal", "mt-10");
  });

  it.each(["article", "p", "h1", "h2", "header", "form"])("renders the requested %s element", (tag) => {
    render(<Reveal as={tag}>content</Reveal>);
    expect(screen.getByText("content").tagName).toBe(tag.toUpperCase());
  });

  it("renders a first-paint entrance without an inline hidden state or a JavaScript visibility gate", () => {
    const html = renderToString(
      <Reveal as="article" entrance="paint" initial={{ opacity: 0, y: 16, scale: 0.96 }}>
        Portrait
      </Reveal>,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    const card = container.querySelector("article");
    expect(card).toHaveClass("paint-reveal");
    expect(card).not.toHaveClass("scroll-reveal");
    expect(card.style.opacity).toBe("");
    expect(card.style.transform).toBe("");
    expect(card).not.toHaveAttribute("data-entrance-waiting");
    expect(card).toHaveTextContent("Portrait");
  });

  it("does not restart a visible entrance that finished before hydration", () => {
    mockBounds(onscreen);
    Object.defineProperty(HTMLElement.prototype, "getAnimations", {
      configurable: true, value: () => [{ playState: "finished" }],
    });
    try {
      render(<Reveal entrance="paint" initial={{ opacity: 0 }}>content</Reveal>);
      const element = screen.getByText("content");
      expect(element).toHaveAttribute("data-entrance-complete", "true");
      expect(element).not.toHaveAttribute("data-entrance-waiting");
      expect(MockIntersectionObserver.instances).toHaveLength(0);
    } finally {
      delete HTMLElement.prototype.getAnimations;
    }
  });

  it("waits for offscreen content to enter the viewport, then completes once", () => {
    mockBounds(offscreenBelow);
    render(<Reveal entrance="paint" initial={{ opacity: 0 }}>content</Reveal>);
    const element = screen.getByText("content");
    const observer = MockIntersectionObserver.instances[0];
    expect(element).toHaveAttribute("data-entrance-waiting", "true");
    act(() => observer.notify([{ isIntersecting: false }]));
    expect(element).toHaveAttribute("data-entrance-waiting", "true");
    act(() => observer.notify([{ isIntersecting: true }]));
    expect(element).not.toHaveAttribute("data-entrance-waiting");
    expect(observer.disconnect).toHaveBeenCalledOnce();
    fireEvent.animationEnd(element);
    expect(element).toHaveAttribute("data-entrance-complete", "true");
  });

  it("keeps first-paint content independent of IntersectionObserver availability", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mockBounds(offscreenBelow);
    render(<Reveal entrance="paint" initial={{ opacity: 0 }}>content</Reveal>);
    expect(screen.getByText("content")).not.toHaveAttribute("data-entrance-waiting");
  });

  it("does not trap a header sliding in from above the viewport behind an observer", () => {
    mockBounds(offscreenAbove);
    render(<Reveal as="header" entrance="paint" initial={{ y: -80 }}>Menu</Reveal>);
    expect(screen.getByText("Menu")).not.toHaveAttribute("data-entrance-waiting");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("reveals waiting content immediately when reduced motion is enabled without remounting it", () => {
    mockBounds(offscreenBelow);
    const listeners = new Set();
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: (_, listener) => listeners.add(listener),
      removeEventListener: (_, listener) => listeners.delete(listener),
    }));
    const { unmount } = render(<Reveal entrance="paint"><input aria-label="Message" /></Reveal>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Keep this answer" } });
    const element = input.parentElement;
    expect(element).toHaveAttribute("data-entrance-waiting", "true");
    act(() => listeners.forEach((listener) => listener({ matches: true })));
    expect(element).not.toHaveAttribute("data-entrance-waiting");
    expect(element).toHaveAttribute("data-entrance-complete", "true");
    expect(screen.getByRole("textbox")).toBe(input);
    expect(input).toHaveValue("Keep this answer");
    unmount();
    expect(listeners.size).toBe(0);
  });
});
