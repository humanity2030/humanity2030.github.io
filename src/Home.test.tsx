import { screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Home } from "./Home";
import { render } from "./test-utils";

describe("Home", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /AI Alignment from the Edge/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
