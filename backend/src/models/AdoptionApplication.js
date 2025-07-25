const mongoose = require("mongoose");

const adoptionApplicationSchema = new mongoose.Schema(
  {
    dog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dog",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationData: {
      experience: {
        type: String,
        enum: ["none", "beginner", "intermediate", "experienced"],
        required: true,
      },
      livingSpace: {
        type: String,
        enum: ["apartment", "house_small_yard", "house_large_yard", "farm"],
        required: true,
      },
      householdMembers: {
        adults: {
          type: Number,
          required: true,
          min: 1,
        },
        children: {
          type: Number,
          default: 0,
          min: 0,
        },
        childrenAges: [Number],
      },
      otherPets: [
        {
          type: {
            type: String,
            enum: ["dog", "cat", "bird", "other"],
          },
          count: Number,
          details: String,
        },
      ],
      workSchedule: {
        type: String,
        enum: [
          "work_from_home",
          "part_time",
          "full_time",
          "retired",
          "student",
        ],
        required: true,
      },
      timeAlone: {
        type: Number, // hours per day
        required: true,
        min: 0,
        max: 24,
      },
      reason: {
        type: String,
        required: [true, "Reason for adoption is required"],
        maxlength: [500, "Reason cannot be longer than 500 characters"],
      },
      vetReference: {
        name: String,
        phone: String,
        clinic: String,
      },
      references: [
        {
          name: {
            type: String,
            required: true,
          },
          relationship: String,
          phone: {
            type: String,
            required: true,
          },
          email: String,
        },
      ],
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "withdrawn"],
      default: "pending",
    },
    reviewNotes: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    homeVisit: {
      scheduled: {
        type: Boolean,
        default: false,
      },
      scheduledDate: Date,
      completed: {
        type: Boolean,
        default: false,
      },
      completedDate: Date,
      notes: String,
      approved: Boolean,
    },
    adoptionFee: {
      amount: {
        type: Number,
        default: 0,
      },
      paid: {
        type: Boolean,
        default: false,
      },
      paymentDate: Date,
      transactionId: String,
    },
    contractSigned: {
      type: Boolean,
      default: false,
    },
    followUp: [
      {
        scheduledDate: Date,
        completedDate: Date,
        notes: String,
        dogWellbeing: {
          type: String,
          enum: ["excellent", "good", "fair", "poor"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes
adoptionApplicationSchema.index({ dog: 1, applicant: 1 });
adoptionApplicationSchema.index({ status: 1, createdAt: -1 });

// Ensure one application per user per dog
adoptionApplicationSchema.index({ dog: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model(
  "AdoptionApplication",
  adoptionApplicationSchema,
);
