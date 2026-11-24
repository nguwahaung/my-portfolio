import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { Header } from "../components/Header";
import { NavigationHistoryProvider } from "../components/NavigationHistory";
import { MockIntersectionObserver } from "./test-utils/mocks";

const { pathname } = vi.hoisted(() => ({ pathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: pathname }));
vi.mock("next/link", async () => (await import("./test-utils/mocks")).nextLinkMock);
vi.mock("next/image", async () => (await import("./test-utils/mocks")).nextImageMock);

function Page() {
  return (
    <NavigationHistoryProvider>
      <Header />
      <main id="main-content">
        <Link href="/contact-me" onClick={event => event.preventDefault()}>Contact from portfolio</Link>
      </main>
    </NavigationHistoryProvider>
  );
}

beforeEach(() => {
  history.replaceState(null, "", "/portfolio");
  pathname.mockReturnValue("/portfolio");
  vi.stubGlobal("scrollX", 0);
  vi.stubGlobal("scrollY", 1350);
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Header return navigation integration", () => {
  it("changes Home to Back after navigation and restores the originating control", async () => {
    const user = userEvent.setup();
    const app = render(<Page />);
    expect(screen.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("button", { name: "Back", exact: true })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Contact from portfolio" }));
    const sourceState = history.state;
    // Next's URL transition is the boundary; Header and its provider stay real.
    act(() => {
      history.pushState({}, "", "/contact-me");
      pathname.mockReturnValue("/contact-me");
      app.rerender(<Page />);
    });
    expect(screen.queryByRole("link", { name: "Home", exact: true })).not.toBeInTheDocument();
    const go = vi.spyOn(history, "go").mockImplementation(() => {});
    await user.click(screen.getByRole("button", { name: "Back", exact: true }));
    expect(go).toHaveBeenCalledExactlyOnceWith(-1);

    act(() => {
      history.replaceState(sourceState, "", "/portfolio");
      pathname.mockReturnValue("/portfolio");
      dispatchEvent(new PopStateEvent("popstate", { state: sourceState }));
      app.rerender(<Page />);
    });
    await waitFor(() => expect(screen.getByRole("link", { name: "Contact from portfolio" })).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 1350, behavior: "instant" });
    expect(screen.getByRole("link", { name: "Home", exact: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Back", exact: true })).not.toBeInTheDocument();
  });
});
