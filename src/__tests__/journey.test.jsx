import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Journey } from "../components/Journey";

vi.mock("lucide-react", () => ({
  Search: () => <svg data-testid="icon-search" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  PaintRoller: () => <svg data-testid="icon-paint-roller" />,
  Layers: () => <svg data-testid="icon-layers" />,
}));

describe("Journey", () => {
  it("renders all 4 process step titles", () => {
    render(<Journey />);
    expect(screen.getByText("Discover & Frame")).toBeInTheDocument();
    expect(screen.getByText("Structure & Design")).toBeInTheDocument();
    expect(screen.getByText("Prototype & Validate")).toBeInTheDocument();
    expect(screen.getByText("Align & Deliver")).toBeInTheDocument();
  });
});
