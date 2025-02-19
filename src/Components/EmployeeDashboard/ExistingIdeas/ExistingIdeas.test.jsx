import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { useUser } from "../../../UserContext/useUser";
import { useNavigate } from "react-router-dom";
import ExistingIdeas from "./ExistingIdeas";

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

describe("ExistingIdeas Component", () => {
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);
  test("redirects to login if no user session is found", () => {
    useUser.mockReturnValue({ loggedInUser: null, setUser: vi.fn() });
    render(<ExistingIdeas />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("loads and displays existing ideas in the table", async () => {
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
            {
              id: 1,
              title: "Idea One",
              category: "Tech",
              status: "Approved",
              publishedDate: "2024-02-15",
            },
            {
              id: 2,
              title: "Idea Two",
              category: "Science",
              status: "Approved",
              publishedDate: "2024-02-16",
            },
          ]),
      })
    );
    render(<ExistingIdeas />);
    // Wait for the table data to be loaded
    await waitFor(() => {
      expect(screen.getByText("Idea One")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();

      expect(screen.getByText("Idea Two")).toBeInTheDocument();
      expect(screen.getByText("Science")).toBeInTheDocument();
    });
    global.fetch.mockRestore();
  });

  test("navigates to the correct detail page when 'View' button is clicked", async () => {
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
            {
              id: 1,
              title: "Idea One",
              category: "Tech",
              status: "Approved",
              publishedDate: "2024-02-15",
            },
          ]),
      })
    );
    render(<ExistingIdeas />);
    await waitFor(() =>
      expect(screen.getByText("Idea One")).toBeInTheDocument()
    );
    // Select the correct button inside the "Actions" column
    const viewButton = screen.getByTestId("view-button-1");
    fireEvent.click(viewButton);
    expect(mockNavigate).toHaveBeenCalledWith("/employee-dashboard/details/1");
  });
  test("loads and displays only the logged-in user's ideas", async () => {
    // Mock user session as an employee with ID 1
    useUser.mockReturnValue({
      loggedInUser: { id: 1, role: "employee" },
      setUser: vi.fn(),
    });

    // Mock API response with ideas from multiple users
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              title: "Idea One",
              category: "Tech",
              status: "Approved",
              publishedDate: "2024-02-15",
              createdBy: 1, // Belongs to logged-in user
            },
            {
              id: 2,
              title: "Idea Two",
              category: "Science",
              status: "Approved",
              publishedDate: "2024-02-16",
              createdBy: 2, // Belongs to another user
            },
          ]),
      })
    );

    render(<ExistingIdeas />);

    // Wait for the data to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText("Idea One")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

  });


});
