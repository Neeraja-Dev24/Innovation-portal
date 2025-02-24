import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"; 
import { useUser } from "../../../UserContext/useUser";
import { useNavigate } from "react-router-dom";
import ApprovedIdeas from "./ApprovedIdeas";

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

// Mock modules
vi.mock("../../../UserContext/useUser", () => ({
  useUser: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

describe("ApprovedIdeas Component", () => {
    let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  test("redirects to login if no user session is found", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useUser.mockReturnValue({ loggedInUser: null, setUser: vi.fn() });
    render(<ApprovedIdeas />);
    expect(mockNavigate).toHaveBeenCalledWith("/login"); 
  });

  test("loads and displays approved ideas in the table", async () => {
    // Mock user session
    useUser.mockReturnValue({
      loggedInUser: { role: "employee" },
      setUser: vi.fn(),
    });
    // Mock API response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: "Idea One", category: "Tech", username: "Alice", status: "Approved", publishedDate: "2024-02-15", acceptedCount: 3 },
            { id: 2, title: "Idea Two", category: "Science", username: "Bob", status: "Approved", publishedDate: "2024-02-16", acceptedCount: 5 },
          ]),
      })
    );
    render(<ApprovedIdeas />);
    // Wait for the table data to be loaded
    await waitFor(() => {
      expect(screen.getByText("Idea One")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      
      expect(screen.getByText("Idea Two")).toBeInTheDocument();
      expect(screen.getByText("Science")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
    global.fetch.mockRestore();
  });


  test("navigates to the correct detail page when 'View More' button is clicked", async () => {
    // Mock user session as an employee
    useUser.mockReturnValue({
      loggedInUser: { role: "employee" },
      setUser: vi.fn(),
    });
    // Mock API response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: "Idea One", category: "Tech", username: "Alice", status: "Approved", publishedDate: "2024-02-15", acceptedCount: 3 },
          ]),
      })
    );
    render(<ApprovedIdeas />);
    await waitFor(() => expect(screen.getByText("Idea One")).toBeInTheDocument());
    // Find the 'View More' button and click it
    const viewButton = screen.getByRole("button", { name: /view/i });
    fireEvent.click(viewButton);
    // Expect navigation to happen with correct route
    expect(mockNavigate).toHaveBeenCalledWith("/employee-dashboard/details/1");
    global.fetch.mockRestore();
  });

  test("navigates to reviewer dashboard details if user is a reviewer", async () => {
    useUser.mockReturnValue({
      loggedInUser: { role: "reviewer" },
      setUser: vi.fn(),
    });
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 2, title: "Idea Two", category: "Science", username: "Bob", status: "Approved", publishedDate: "2024-02-16", acceptedCount: 5 },
          ]),
      })
    );
    render(<ApprovedIdeas />);
    await waitFor(() => expect(screen.getByText("Idea Two")).toBeInTheDocument());
    const viewButton = screen.getByRole("button", { name: /view/i });
    fireEvent.click(viewButton);
    expect(mockNavigate).toHaveBeenCalledWith("/reviewer-dashboard/details/2");
    global.fetch.mockRestore();
  });
});
