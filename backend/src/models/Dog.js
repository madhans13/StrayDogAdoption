const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dog name is required"],
      trim: true,
      maxlength: [30, "Name cannot be longer than 30 characters"],
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [20, "Age seems unrealistic"],
    },
    ageCategory: {
      type: String,
      enum: ["puppy", "young", "adult", "senior"],
      default: "adult",
    },
    breed: {
      type: String,
      trim: true,
      default: "Mixed",
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "extra-large"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String, // Cloudinary public ID
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: [
        "available",
        "adopted",
        "pending",
        "medical_care",
        "fostered",
        "unavailable",
      ],
      default: "available",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    healthInfo: {
      vaccinated: {
        type: Boolean,
        default: false,
      },
      sterilized: {
        type: Boolean,
        default: false,
      },
      dewormed: {
        type: Boolean,
        default: false,
      },
      medicalConditions: [
        {
          condition: String,
          severity: {
            type: String,
            enum: ["mild", "moderate", "severe"],
          },
          treatment: String,
          treatedDate: Date,
        },
      ],
      medicalNotes: {
        type: String,
        maxlength: [500, "Medical notes cannot be longer than 500 characters"],
      },
      lastVetVisit: Date,
    },
    behavior: {
      temperament: [
        {
          type: String,
          enum: [
            "friendly",
            "aggressive",
            "shy",
            "playful",
            "calm",
            "energetic",
            "protective",
          ],
        },
      ],
      goodWithKids: {
        type: Boolean,
        default: true,
      },
      goodWithPets: {
        type: Boolean,
        default: true,
      },
      trainingLevel: {
        type: String,
        enum: ["none", "basic", "intermediate", "advanced"],
        default: "none",
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rescueDate: {
      type: Date,
      default: Date.now,
    },
    adoptionHistory: [
      {
        adopter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        adoptionDate: Date,
        returnDate: Date,
        returnReason: String,
        status: {
          type: String,
          enum: ["active", "returned", "completed"],
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
dogSchema.index({ location: "2dsphere" });
dogSchema.index({ status: 1, createdAt: -1 });
dogSchema.index({ breed: 1, size: 1, age: 1 });
dogSchema.index({ urgency: -1, createdAt: -1 });

// Virtual for adoption applications
dogSchema.virtual("adoptionApplications", {
  ref: "AdoptionApplication",
  localField: "_id",
  foreignField: "dog",
});

// Method to increment views
dogSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to find nearby dogs
dogSchema.statics.findNearby = function (
  longitude,
  latitude,
  maxDistance = 10000,
) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
    status: "available",
  });
};

module.exports = mongoose.model("Dog", dogSchema);
