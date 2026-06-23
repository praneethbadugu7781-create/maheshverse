const mongoose = require("mongoose");
const { Schema } = mongoose;

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    type: {
      type: String,
      required: true,
      enum: ["Call", "WhatsApp", "Schedule Visit", "Request Callback", "Enquiry Form"],
      default: "Enquiry Form"
    },
    status: {
      type: String,
      required: true,
      enum: ["New", "Contacted", "Interested", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
