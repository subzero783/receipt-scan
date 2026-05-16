import { Schema, model, models } from "mongoose";

const PendingUserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    inboundHandle: { type: String, required: false },
    authProvider: { type: String, default: 'email' },
}, {
    timestamps: true,
});

const PendingUser = models.PendingUser || model("PendingUser", PendingUserSchema);
export default PendingUser;