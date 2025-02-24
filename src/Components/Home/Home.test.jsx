import { render, screen } from "@testing-library/react";
import Home from "./Home"; // Adjust the path as needed
import {vi,expect, test} from "vitest";

// Mocking dependencies
vi.mock("../Auth/Login/Login", () => ({
  default: vi.fn(() => <div data-testid="mock-login">Mocked Login Component</div>),
}));

vi.mock("../Header/HeaderNav", () => ({
  default: vi.fn(() => <header data-testid="mock-header">Mocked Header</header>),
}));

test("renders Layout with HeaderNav and Login components", () => {
  render(<Home />);

  // Use data-testid for specificity
  expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  expect(screen.getByTestId("mock-login")).toBeInTheDocument();
});
