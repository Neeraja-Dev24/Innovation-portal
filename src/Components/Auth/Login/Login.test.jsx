import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "../../../UserContext/UserProvider";
import Login from "./Login";
import { vi } from "vitest";

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

describe("Login Component", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Login />
        </UserProvider>
      </MemoryRouter>
    );

    // Verify the presence of form fields
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows user to enter login credentials", () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Login />
        </UserProvider>
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: "input" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("shows an error message when submitting with empty fields", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Login />
        </UserProvider>
      </MemoryRouter>
    );
  
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);
    const usernameError = await screen.findByText(/Please enter your username!/i);
    expect(usernameError).toBeInTheDocument();
    const passwordError = await screen.findByText(/Please enter your password!/i);
    expect(passwordError).toBeInTheDocument();
  });

  test("navigates to Forgot Password page when clicked", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    );
  
    const forgotPasswordLink = screen.getByText(/Forgot Password\?/i);
    fireEvent.click(forgotPasswordLink);
    // Ensure the "Forgot Password Page" is rendered
    expect(screen.getByText(/Forgot Password Page/i)).toBeInTheDocument();
  });
  
test("navigates to Signup Page when not registered", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<div>Signup Page</div>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  );

  // Find the "Don't have an account? Sign Up" link
  const signUpLink = screen.getByText(/Don't have an account\? Sign Up/i);
  
  fireEvent.click(signUpLink);

  // Ensure the "Signup Page" is rendered
  expect(screen.getByText(/Signup Page/i)).toBeInTheDocument();
});

});
