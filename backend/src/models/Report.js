const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["stray_found", "injured_animal", "abuse_case", "lost_pet"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporterContact: {
      name: String,
      phone: String,
      email: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNotes: {
      type: String,
      maxlength: [500, "Resolution notes cannot be longer than 500 characters"],
    },
    resolvedAt: Date,
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
reportSchema.index({ location: "2dsphere" });
reportSchema.index({ status: 1, urgency: -1, createdAt: -1 });
reportSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
