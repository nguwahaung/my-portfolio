import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BetterHRPage } from "../views/BetterHRPage";
import { KBZBankPage } from "../views/KBZBankPage";
import { UniLinksPage } from "../views/UniLinksPage";
import { WctPage } from "../views/WctPage";

vi.mock("next/image", async () => (await import("./test-utils/mocks")).nextImageMock);

vi.mock("@/components/Header", () => ({ Header: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/CaseStudyAuthor", () => ({ CaseStudyAuthor: () => null }));

vi.mock("lucide-react", () => ({
  Clock: () => <svg />,
  Globe: () => <svg />,
  ExternalLink: () => <svg />,
  TabletSmartphone: () => <svg />,
  Briefcase: () => <svg />,
}));

describe("Live-project navigation", () => {
  it.each([
    [BetterHRPage, "https://betterhr.com/"],
    [KBZBankPage, "https://selfservice.kbzbank.com/"],
    [UniLinksPage, "https://unilinks.co/"],
    [WctPage, "https://www.wctpay.com/"],
  ])("opens %s in a new tab without an opening notice", (Page, href) => {
    render(<Page />);
    const link = screen.getByRole("link", { name: "Live Project" });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("title");
    expect(link).not.toHaveAccessibleDescription();
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
