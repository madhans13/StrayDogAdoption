const Dog = require("../models/Dog");

// @desc    Get all dogs
// @route   GET /api/v1/dogs
// @access  Public
const getDogs = async (req, res) => {
  try {
    // Build query
    let query = { isActive: true };

    // Filtering
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.breed) {
      query.breed = new RegExp(req.query.breed, "i");
    }

    if (req.query.size) {
      query.size = req.query.size;
    }

    if (req.query.urgency) {
      query.urgency = req.query.urgency;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sort
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort;
      sortBy = { [sortField]: req.query.order === "asc" ? 1 : -1 };
    }

    // Execute query
    const dogs = await Dog.find(query)
      .populate("reportedBy", "name email phone")
      .populate("assignedNGO", "name email phone")
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    // Get total count for pagination
    const total = await Dog.countDocuments(query);

    // Pagination info
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    res.status(200).json({
      success: true,
      count: dogs.length,
      pagination,
      data: dogs,
    });
  } catch (error) {
    console.error("Get dogs error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get single dog
// @route   GET /api/v1/dogs/:id
// @access  Public
const getDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id)
      .populate("reportedBy", "name email phone location")
      .populate("assignedNGO", "name email phone location")
      .populate("adoptionApplications");

    if (!dog || !dog.isActive) {
      return res.status(404).json({
        success: false,
        error: "Dog not found",
      });
    }

    // Increment views
    await dog.incrementViews();

    res.status(200).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    console.error("Get dog error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Create new dog listing
// @route   POST /api/v1/dogs
// @access  Private
const createDog = async (req, res) => {
  try {
    // Add user to req.body
    req.body.reportedBy = req.user.id;

    const dog = await Dog.create(req.body);

    res.status(201).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    console.error("Create dog error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update dog
// @route   PUT /api/v1/dogs/:id
// @access  Private
const updateDog = async (req, res) => {
  try {
    let dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        error: "Dog not found",
      });
    }

    // Make sure user is dog owner or admin/ngo
    if (
      dog.reportedBy.toString() !== req.user.id &&
      !["admin", "ngo"].includes(req.user.role)
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this dog",
      });
    }

    dog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    console.error("Update dog error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete dog
// @route   DELETE /api/v1/dogs/:id
// @access  Private (Admin/NGO only)
const deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        error: "Dog not found",
      });
    }

    // Soft delete - set isActive to false
    dog.isActive = false;
    await dog.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Delete dog error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get nearby dogs
// @route   GET /api/v1/dogs/nearby
// @access  Public
const getNearbyDogs = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        error: "Please provide longitude and latitude",
      });
    }

    const dogs = await Dog.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance),
    ).populate("reportedBy", "name email phone");

    res.status(200).json({
      success: true,
      count: dogs.length,
      data: dogs,
    });
  } catch (error) {
    console.error("Get nearby dogs error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Upload dog images
// @route   POST /api/v1/dogs/:id/images
// @access  Private
const uploadDogImages = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        error: "Dog not found",
      });
    }

    // TODO: Implement file upload logic with Cloudinary
    // This is a placeholder for now

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: dog,
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
  uploadDogImages,
  getNearbyDogs,
};
