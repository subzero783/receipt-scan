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
    expect(body).toEqual({ message: "User created successfully" });

    // // Check that our mocks were called correctly
    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 5);
    expect(User.create).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword123",
    });
  });

  // Test 2: The "Sad Path" - the user already exists
  it("should return 400 if user already exists", async () => {
    // --- Arrange ---
    connectDB.mockResolvedValue(true);
    User.findOne.mockResolvedValue({
      _id: "67890",
      email: "existing@example.com",
    }); // Simulate "user does exist"

    const mockSave = jest.fn();
    User.create.mockResolvedValue({ save: mockSave });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      }),
    };

    // --- Act ---
    const response = await POST(mockRequest);
    // --- THIS IS THE FIX ---
    const body = await response.json();
    // --- END FIX ---

    // --- Assert ---
    expect(response.status).toBe(400);
    // Assert against the object property
    expect(body).toEqual({ message: "User already exists" });

    expect(User.findOne).toHaveBeenCalledWith({ email: "existing@example.com" });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  // Test 3: The "Error Path" - the database fails to save
  it("should return 500 if database save fails", async () => {
    // --- Arrange ---
    connectDB.mockResolvedValue(true);
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpassword123");

    const dbError = new Error("Database save error");
    const mockSave = jest.fn().mockRejectedValue(dbError);
    User.create.mockResolvedValue({
      save: mockSave,
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    };

    // --- Act ---
    const response = await POST(mockRequest);
    // --- THIS REMAINS .text() ---
    // Because your catch block returns a plain string
    const body = await response.json();
    // --- END FIX ---

    // --- Assert ---
    expect(response.status).toBe(500);
    // expect(body).toBe("Database save error"); // This is correct
    expect(body).toEqual({ error: "Database save error" });

    expect(User.create).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
});
