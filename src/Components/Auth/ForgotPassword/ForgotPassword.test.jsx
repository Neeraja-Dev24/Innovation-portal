import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";  // Import MemoryRouter here
import { UserProvider } from "../../../UserContext/UserProvider";
import ForgotPassword from "./ForgotPassword";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
  MemoryRouter: ({ children }) => <div>{children}</div>,  // Mock MemoryRouter
}));

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
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
  

describe("ForgotPassword Component", () => {
  test("renders the reset password form with required fields", () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <ForgotPassword />
        </UserProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  test("shows error message when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <ForgotPassword />
        </UserProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@user.com" } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "differentPassword123" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    // Assert that the error message is shown for password mismatch
    await waitFor(() => expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument());
  });

//   test("successfully submits the form and redirects to login", async () => {
//     const navigate = vi.fn(); // Mock navigate function

//     render(
//       <MemoryRouter>
//         <UserProvider>
//           <ForgotPassword />
//         </UserProvider>
//       </MemoryRouter>
//     );

//     fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@user.com" } });
//     fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newPassword123" } });
//     fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "newPassword123" } });

//     fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

//     // Wait for success message and navigation to login page
//     await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/reset-password", expect.any(Object)));
//     await waitFor(() => expect(screen.getByText(/Password updated successfully!/i)).toBeInTheDocument());
//     await waitFor(() => expect(navigate).toHaveBeenCalledWith("/login"));
//   });

  test("shows error message on failed password reset", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Failed to reset password" }),
    });

    render(
      <MemoryRouter>
        <UserProvider>
          <ForgotPassword />
        </UserProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@user.com" } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "newPassword123" } });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    // Assert that the error message is shown for the failed request
    await waitFor(() => expect(screen.getByText(/Failed to reset password/i)).toBeInTheDocument());
  });

//   test("navigates back to login page when Back to Login is clicked", () => {
//     const navigate = vi.fn();

//     render(
//       <MemoryRouter initialEntries={["/forgot-password"]}>
//         <UserProvider>
//           <ForgotPassword />
//         </UserProvider>
//       </MemoryRouter>
//     );

//     const backToLoginLink = screen.getByText(/Back to Login/i);
//     fireEvent.click(backToLoginLink);

//     expect(navigate).toHaveBeenCalledWith("/login");
//   });
});
