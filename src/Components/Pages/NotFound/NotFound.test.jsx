import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter,useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { describe, expect, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("NotFound Component",()=>{
    test("renders NotFound component correctly", () => {
        render(
          <MemoryRouter>
            <NotFound />
          </MemoryRouter>
        );
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("404 - Page Not Found");
        expect(screen.getByText("Oops! The page you are looking for does not exist.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
      });
      
      test("navigates to /login when Go Back button is clicked", async () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
      
        render(
          <MemoryRouter>
            <NotFound />
          </MemoryRouter>
        );
        const button = screen.getByRole("button", { name: "Go Back" });
        await userEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
})

