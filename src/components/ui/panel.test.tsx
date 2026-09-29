import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PanelHeader, SummaryBanner } from './panel';

it('makes the optional section explanation available on keyboard focus', async () => {
  render(<PanelHeader title="// Results" info="Timing evidence" />);
  expect(screen.queryByText('Timing evidence')).not.toBeInTheDocument();
  await userEvent.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Timing evidence');
});
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
