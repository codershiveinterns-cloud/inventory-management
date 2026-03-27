import mongoose from "mongoose";

const webhookLogSchema = new mongoose.Schema({
  webhookId: {
    type: String,
    required: true,
    unique: true,
  },
  shopDomain: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
});

const WebhookLog = mongoose.model("WebhookLog", webhookLogSchema);

export default WebhookLog;
