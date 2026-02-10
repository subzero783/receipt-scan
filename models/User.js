import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: false
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpire: {
      type: Date,
      required: false,
    },
    // Payment and Subscription Updates
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to not conflict
    },
    subscriptionId: {
      type: String,
    },
    isPro: {
      type: Boolean,
      default: false, // Default to Free plan
    },
    planType: {
      type: String,
      default: 'free', // 'free' or 'pro'
    },
    inboundHandle: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls for old users until migrated
      description: "The unique part of the email address for inbound receipts (e.g. 'steve' in steve@reermi.resend.app)"
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);
// Added a comment to User model
export default User;
