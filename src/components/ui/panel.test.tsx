import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryBanner } from "./panel";

describe("SummaryBanner", () => {
  it("renders four skeleton items while loading", () => {
    const { container } = render(
      <SummaryBanner loading>
        Elite Men · 12 Sessions · 4 Finals · 80 Riders
      </SummaryBanner>,
    );

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(container.querySelectorAll('[class*="summarySkeleton"]')).toHaveLength(4);
    expect(screen.queryByText("Elite Men")).not.toBeInTheDocument();
  });

  it("renders summary values after loading", () => {
    render(
      <SummaryBanner>
        Elite Men · 12 Sessions · 4 Finals · 80 Riders
      </SummaryBanner>,
    );

    expect(screen.getByText("Elite Men")).toBeInTheDocument();
    expect(screen.getByText("12 Sessions")).toBeInTheDocument();
    expect(screen.getByText("4 Finals")).toBeInTheDocument();
    expect(screen.getByText("80 Riders")).toBeInTheDocument();
  });
});
