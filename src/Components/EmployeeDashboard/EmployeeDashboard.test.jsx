import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../../UserContext/UserProvider";
import EmployeeDashboard from "./EmployeeDashboard";
import { test, vi } from "vitest";
import "@testing-library/jest-dom";
import { Layout, Typography, Menu, Button } from "antd";

vi.mock("antd", async () => {
  const antd = await vi.importActual("antd");
  return {
    ...antd,
    Drawer: ({ open, onClose, children }) => (open ? <div data-testid="drawer">{children}<button onClick={onClose}>Close</button></div> : null),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/employee-dashboard/approvedIdeas" }),
    Outlet: () => <div>Mocked Outlet</div>,
  };
});

const mockLogOut = vi.fn();
vi.mock("../../UserContext/useUser", () => ({
  useUser: () => ({ loggedInUser: { name: "John Doe", role: "employee" }, logOut: mockLogOut }),
}));

describe("EmployeeDashboard", () => {
  test("renders the dashboard correctly", () => {
    render(
      <UserProvider>
        <MemoryRouter>
          <EmployeeDashboard />
        </MemoryRouter>
      </UserProvider>
    );

    expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
    expect(screen.getByText("Approved Ideas")).toBeInTheDocument();
    expect(screen.getByText("My Ideas")).toBeInTheDocument();
    expect(screen.getByText("Submit Idea")).toBeInTheDocument();
  });

  test("navigates to selected menu item", () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("My Ideas"));
    expect(mockNavigate).toHaveBeenCalledWith("/employee-dashboard/myIdeas");
  });

  test("logs out the user when clicking the logout button", () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogOut).toHaveBeenCalled();
  });
  test('opens and closes the drawer menu', async () => {
    render(<EmployeeDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(await screen.findByTestId('drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
});

});
