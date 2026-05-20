import { Schema, model, models } from "mongoose";

const KeywordQueueSchema = new Schema({
    keyword: { type: String, required: true },
    isProcessed: { type: Boolean, default: false },
});

export default models.KeywordQueue || model("KeywordQueue", KeywordQueueSchema);