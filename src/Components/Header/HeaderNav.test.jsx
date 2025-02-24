import { render, screen } from "@testing-library/react";
import HeaderNav from "../Header/HeaderNav";
import { expect, test } from "vitest";

test("renders HeaderNav with title", () => {
  render(<HeaderNav />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByTestId("header-title")).toHaveTextContent("Innovation Portal");
});
