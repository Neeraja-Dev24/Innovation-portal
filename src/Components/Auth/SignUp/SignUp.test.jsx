import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter} from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import Signup from "./Signup";
import { UserProvider } from "../../../UserContext/UserProvider";

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
// Mock the `useNavigate` hook to avoid actual navigation
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock fetch API
vi.stubGlobal("fetch", vi.fn());


describe("Signup Component", () => {
  beforeEach(() => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Signup successful!" }),
    });
  });
  

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders the signup form with required fields", () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Signup />
        </UserProvider>
      </MemoryRouter>
    );

    // Check if the form fields and button are rendered
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

    // Target each password input field specifically
    expect(
      screen.getByLabelText("Password", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Confirm Password", { selector: "input" })
    ).toBeInTheDocument();
  });

  test('validates passwords match before submitting', async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Signup />
        </UserProvider>
      </MemoryRouter>
    );

    const passwordInputs = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); 
    fireEvent.change(passwordInputs[1], { target: { value: 'password456' } }); 
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/Passwords do not match/)).toBeInTheDocument();
  });

    // test('successfully submits the form and redirects to login page', async () => {
    //   render(
    //     <MemoryRouter initialEntries={['/signup']}>
    //       <UserProvider>
    //         <Routes>
    //           <Route path="/signup" element={<Signup />} />
    //           <Route path="/login" element={<div>Login Page</div>} />
    //         </Routes>
    //       </UserProvider>
    //     </MemoryRouter>
    //   );

    //   fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    //   fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johndoe' } });
    //   fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    //   const passwordFields = screen.getAllByLabelText(/Password/i);
    //   fireEvent.change(passwordFields[0], { target: { value: 'password123' } }); // First password field (Password)
    //   fireEvent.change(passwordFields[1], { target: { value: 'password123' } }); // Second password field (Confirm Password)
    //   fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'employee' } });
    //   fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    //   // Wait for successful message and check if navigation occurs
    //   await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    //   expect(screen.getByText(/Signup successful!/i)).toBeInTheDocument();

    // });

    test('shows error when passwords do not match', async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <Signup />
          </UserProvider>
        </MemoryRouter>
      );

      const passwordInputs = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); 
    fireEvent.change(passwordInputs[1], { target: { value: 'password456' } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(await screen.findByText(/Passwords do not match/)).toBeInTheDocument();
    });

    test('handles failed signup due to API error', async () => {
      fetch.mockRejectedValueOnce(new Error("Signup failed. Please try again."));
    
      render(
        <MemoryRouter>
          <UserProvider>
            <Signup />
          </UserProvider>
        </MemoryRouter>
      );
    
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'janedoe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
      const passwordInputs = screen.getAllByLabelText(/Password/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); 
      fireEvent.change(passwordInputs[1], { target: { value: 'password123' } }); 
      fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'reviewer' } });
    
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
      await waitFor(() => screen.debug()); 
      
    });
    

    // test('navigates to login page if already have an account', async () => {
    //   render(
    //     <MemoryRouter >
    //       <UserProvider>
    //         <Signup />
    //       </UserProvider>
    //     </MemoryRouter>
    //   );

    //    // Find the "Don't have an account? Sign Up" link
    //     const LoginLink = screen.getByText(/Already have an account\? Login/i);
    //     fireEvent.click(LoginLink);
    //     // Ensure the "Signup Page" is rendered
    //      //expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
      
    // });
});
