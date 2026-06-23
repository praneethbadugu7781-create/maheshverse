const mongoose = require("mongoose");
const { Schema } = mongoose;

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Lands", "Flats", "Houses"],
    },
    images: { type: [String], default: [] },
    videoUrl: { type: String, required: true },
    highlights: { type: [String], default: [] },
    specifications: { type: Map, of: String, default: {} },
    googleMapUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Property || mongoose.model("Property", PropertySchema);
