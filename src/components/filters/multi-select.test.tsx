import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MultiSelect } from "./multi-select";

const options = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
];

function ControlledMultiSelect() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  return (
    <MultiSelect
      label="Seasons"
      options={options}
      selectedValues={selectedValues}
      onSelectionChange={setSelectedValues}
    />
  );
}

describe("MultiSelect", () => {
  it("supports selecting controlled values without a clear action", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);

    await user.click(screen.getByRole("button", { name: /seasons/i }));
    await user.click(screen.getByRole("option", { name: "2026" }));
    expect(
      screen.getByRole("button", { name: /seasons \(1\)/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /clear selection/i }),
    ).not.toBeInTheDocument();
  });

  it("opens from the keyboard and exposes selected state", async () => {
    const user = userEvent.setup();
    render(<ControlledMultiSelect />);
    const trigger = screen.getByRole("button", { name: /^seasons$/i });
    trigger.focus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("option", { name: "2026" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
