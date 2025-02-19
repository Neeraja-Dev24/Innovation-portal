import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../UserContext/useUser";
import SubmitIdeas from "./SubmitIdeas";

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

vi.mock("antd", async () => {
  const actualAntd = await vi.importActual("antd");
  return {
    ...actualAntd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock("../../../UserContext/useUser", () => ({
  useUser: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

describe("SubmitIdeas Component", () => {
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("redirects to login if no user session is found", () => {
    useUser.mockReturnValue({ loggedInUser: null, setUser: vi.fn() });
    render(<SubmitIdeas />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("does not redirect if user is logged in", () => {
    useUser.mockReturnValue({
      loggedInUser: {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      setUser: vi.fn(),
    });
    render(<SubmitIdeas />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("renders form fields correctly", () => {
    useUser.mockReturnValue({
      loggedInUser: {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      setUser: vi.fn(),
    });
    render(<SubmitIdeas />);
    expect(screen.getByText("Submit New Idea")).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("preloads form data when editing an idea", async () => {
    useUser.mockReturnValue({
      loggedInUser: {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      setUser: vi.fn(),
    });
    useParams.mockReturnValue({ ideaId: "123" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 123,
        title: "Test Idea",
        category: "Technology",
        description: "<p>Test description</p>",
        files: [{ name: "file.pdf", url: "http://example.com/file.pdf" }],
      }),
    });
    render(<SubmitIdeas />);
    await waitFor(() =>
      expect(screen.getByDisplayValue("Test Idea")).toBeInTheDocument()
    );
    expect(screen.getByText("Edit/Resubmit Idea")).toBeInTheDocument();
  });

  test("handles file uploads correctly", async () => {
    useUser.mockReturnValue({
      loggedInUser: {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
      },
      setUser: vi.fn(),
    });
    render(<SubmitIdeas />);
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const uploadInput = screen.getByLabelText(/Upload Supporting Documents/i);
    fireEvent.change(uploadInput, {
      target: { files: [file] },
    });
    await waitFor(() =>
      expect(screen.getByText("test.pdf")).toBeInTheDocument()
    );
  });
});
