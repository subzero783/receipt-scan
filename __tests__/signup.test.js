import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignupPage from "../page";

// Mock dependencies from next-auth and next/navigation
jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignupPage", () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  // Mock the global fetch API
  global.fetch = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
    // Default session status for rendering the form
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  const renderComponent = () => render(<SignupPage />);

  it("should render the signup form", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: /signup/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register with email/i })).toBeInTheDocument();
  });

  it("should display an error message for an invalid email", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register with email/i }));

    expect(await screen.findByText("Email is invalid")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should display an error message for a password shorter than 8 characters", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register with email/i }));

    expect(await screen.findByText("Password is invalid")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should display an error if the email is already registered (400)", async () => {
    global.fetch.mockResolvedValueOnce({ status: 400 });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "registered@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register with email/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("This email is already registered")).toBeInTheDocument();
  });

  it("should submit the form and redirect on successful registration (201)", async () => {
    global.fetch.mockResolvedValueOnce({ status: 201 });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register with email/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/signup", expect.any(Object));
    });

    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });
});
