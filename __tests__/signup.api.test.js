/**
 * @jest-environment node
 */

import { POST } from "@/app/api/signup/route";
import connectDB from "@/config/database";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import bcrypt from "bcryptjs";

// Mock database connection
jest.mock("@/config/database", () => jest.fn().mockResolvedValue(true));

// Mock User Model
jest.mock("@/models/User", () => {
  const mockUserInstance = {
    _id: "12345",
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword123",
    save: jest.fn().mockResolvedValue(true),
  };
  const MockUser = jest.fn().mockImplementation(() => mockUserInstance);
  MockUser.findOne = jest.fn();
  MockUser.create = jest.fn();
  MockUser.findById = jest.fn();
  return {
    __esModule: true,
    default: MockUser,
    mockInstance: mockUserInstance,
  };
});

// Mock PendingUser Model
jest.mock("@/models/PendingUser", () => {
  const mockPendingUserInstance = {
    _id: "pending_123",
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword123",
    save: jest.fn().mockResolvedValue(true),
  };
  const MockPendingUser = jest.fn().mockImplementation(() => mockPendingUserInstance);
  MockPendingUser.findOne = jest.fn();
  MockPendingUser.findById = jest.fn();
  MockPendingUser.findByIdAndDelete = jest.fn();
  MockPendingUser.create = jest.fn();
  return {
    __esModule: true,
    default: MockPendingUser,
    mockInstance: mockPendingUserInstance,
  };
});

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            url: "https://checkout.stripe.com/pay/cs_test_123",
          }),
        },
      },
    };
  });
});

describe("POST /api/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Happy Path - brand new user is added to PendingUser and Stripe URL returned
  it("should create a pending user and return Stripe checkout URL with 201", async () => {
    User.findOne.mockResolvedValue(null);
    PendingUser.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpassword123");

    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
      json: jest.fn().mockResolvedValue({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    };

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ url: "https://checkout.stripe.com/pay/cs_test_123" });

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(PendingUser.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    
    // Retrieve mockInstance from the mocked module to verify save call
    const { mockInstance } = require("@/models/PendingUser");
    expect(mockInstance.save).toHaveBeenCalledTimes(1);
  });

  // Test 2: Sad Path - user already exists in User collection
  it("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "67890",
      email: "existing@example.com",
    });

    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
      json: jest.fn().mockResolvedValue({
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      }),
    };

    const response = await POST(mockRequest);
    const bodyText = await response.text();

    expect(response.status).toBe(400);
    expect(bodyText).toBe("Email already exists");

    expect(User.findOne).toHaveBeenCalledWith({ email: "existing@example.com" });
    expect(PendingUser.findOne).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  // Test 3: Error Path - database save fails
  it("should return 500 if database save fails", async () => {
    User.findOne.mockResolvedValue(null);
    PendingUser.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpassword123");

    const dbError = new Error("Database save error");
    const { mockInstance } = require("@/models/PendingUser");
    mockInstance.save.mockRejectedValueOnce(dbError);

    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
      json: jest.fn().mockResolvedValue({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    };

    const response = await POST(mockRequest);
    const bodyText = await response.text();

    expect(response.status).toBe(500);
    expect(bodyText).toBe("Server error");

    expect(mockInstance.save).toHaveBeenCalledTimes(1);
  });
});
