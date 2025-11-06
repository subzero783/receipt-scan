/**
 * @jest-environment node
 */

import { POST } from "@/app/api/signup/route";

// Import the dependencies we need to mock
import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Mock the dependencies
// We don't want to connect to the real DB or hash real passwords
jest.mock("@/config/database");
jest.mock("@/models/User");
jest.mock("bcryptjs");

describe("POST /api/signup", () => {
  // Clear all mock call counts before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: The "Happy Path" - a new user is created successfully
  it("should create a new user and return 201", async () => {
    // --- Arrange (Set up the test) ---

    // 1. Mock the return values of our dependencies
    connectDB.mockResolvedValue(true);
    User.findOne.mockResolvedValue(null); // Simulate "user does not exist"
    bcrypt.hash.mockResolvedValue("hashedpassword123"); // Mock the hashed password
    User.create.mockResolvedValue({
      _id: "12345",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword123",
      save: jest.fn().mockResolvedValue(true), // Mock the save method
    });

    // 2. Create a mock request object
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    };

    // --- Act (Run the function) ---
    const response = await POST(mockRequest);
    const body = await response.json();

    // --- Assert (Check the results) ---
    expect(response.status).toBe(201);
    expect(body).toBe("User created successfully");

    // Check that our mocks were called correctly
    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 5);
    expect(User.create).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword123",
    });
  });
});
