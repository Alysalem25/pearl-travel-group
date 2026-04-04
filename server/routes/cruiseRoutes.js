const express = require("express");
// use the cruisies-specific upload middleware (stores in uploads/Cruisies)
const uploadCruisies = require("../middlewares/uploadCruisies");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const Cruisies = require("../models/Cruisies");
const BookedCruisies = require("../models/BookedCruseies");
const User = require("../models/Users");
const router = express.Router();

/**
 * Image path normalization helper
 */
function normalizeImagePath(imagePath) {
  // Check if already normalized
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  // folder on disk uses uppercase 'Cruisies', so reflect that in URL
  return `/uploads/Cruisies/${imagePath}`;
}


/**
 * GET /cruisies
 * Get all cruises - PUBLIC ROUTE
 */
router.get("/", async (req, res, next) => {
  try {
    const cruises = await Cruisies.find();
    const normalized = cruises.map(c => ({
      ...c.toObject(),
      images: c.images ? c.images.map(normalizeImagePath) : []
    }));
    res.json(normalized);
  } catch (err) {
    next(err);
  }
});



/**
 * POST /cruisies
 * Create new cruise - ADMIN ONLY
 */
router.post(
  "/",
  authMiddleware,
  authorize("add_cruise"),
  // accept up to 5 images in the 'images' field
  uploadCruisies.array("images", 5),
  async (req, res, next) => {
    try {
      const {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        durationDays,
        durationNights,
        price,
        status,
        days
      } = req.body;

      // files uploaded by multer
      const images = (req.files || []).map(f => "/uploads/Cruisies/" + f.filename);

      const cruise = new Cruisies({
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        durationDays,
        durationNights,
        price,
        status,
        images,
        days: days ? JSON.parse(days) : []
      });

      await cruise.save();

      const response = {
        ...cruise.toObject(),
        images: cruise.images ? cruise.images.map(normalizeImagePath) : []
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /cruisies/:id
 * Update cruise by ID - ADMIN ONLY
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("edit_cruise"),
  uploadCruisies.array("images", 5),
  async (req, res, next) => {
    try {
      const {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        durationDays,
        durationNights,
        price,
        status,
        days
      } = req.body;

      const updateData = {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        durationDays,
        durationNights,
        price,
        status,
        days: days ? JSON.parse(days) : undefined
      };

      // clean undefined fields
      Object.keys(updateData).forEach(
        key => updateData[key] === undefined && delete updateData[key]
      );

      const cruise = await Cruisies.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!cruise) {
        return res.status(404).json({ error: "Cruise not found" });
      }

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => "/uploads/Cruisies/" + f.filename);
        cruise.images.push(...newImages);
        await cruise.save();
      }

      const response = {
        ...cruise.toObject(),
        images: cruise.images ? cruise.images.map(normalizeImagePath) : []
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);


/**
 * POST /cruisies/:id/images
 * Add images to existing cruise - ADMIN ONLY
 */
router.post(
  "/:id/images",
  authMiddleware,
  authorize("add_cruise"),
  uploadCruisies.array("images", 5),
  async (req, res, next) => {
    try {
      const cruise = await Cruisies.findById(req.params.id);

      if (!cruise) {
        return res.status(404).json({ error: "Cruise not found" });
      }

      const images = (req.files || []).map(f => "/uploads/Cruisies/" + f.filename);
      cruise.images.push(...images);

      await cruise.save();

      const response = {
        ...cruise.toObject(),
        images: cruise.images ? cruise.images.map(normalizeImagePath) : []
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

//  delete /cruisies
router.delete("/:id", authMiddleware,
  authorize("delete_cruise"),
  async (req, res, next) => {
    try {
      const cruise = await Cruisies.findByIdAndDelete(req.params.id);
      if (!cruise) return res.status(404).json({ error: "Cruise not found" });
      res.json({ message: "Cruise deleted" });
    } catch (err) {
      next(err);
    }
  }
)

router.get("/type/:type", async (req, res) => {
  try {

    const type =
      req.params.type.charAt(0).toUpperCase() +
      req.params.type.slice(1).toLowerCase();

    const cruises = await Cruisies.find({
      category: type,
      status: "active"
    });

    const normalized = cruises.map(c => ({
      ...c.toObject(),
      images: c.images ? c.images.map(normalizeImagePath) : []
    }));

    res.json(normalized);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// book a cruise
router.post("/book", async (req, res) => {
  try {
    const { userEmail, userName, userNumber, message, cruiseId } = req.body;

    const bookedCruisies = new BookedCruisies({
      userEmail,
      userName,
      userNumber,
      message,
      cruisies: cruiseId, // map frontend value
    });

    await bookedCruisies.save();

    res.json({
      success: true,
      message: "Booking created successfully",
      data: bookedCruisies
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// get all booked cruises
router.get("/book", async (req, res) => {
  try {
    const bookedCruisies = await BookedCruisies.find().populate("cruisies").populate("reviewedBy", "name");
    res.json(bookedCruisies); // must be an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//  delete booked cruise /cruisies/book/:id
router.delete("/book/:id", authMiddleware,
  authorize("manage_booked_cruises"),
  async (req, res, next) => {
    try {
      const bookedCruisies = await BookedCruisies.findByIdAndDelete(req.params.id);
      if (!bookedCruisies) return res.status(404).json({ error: "Booking not found" });
      res.json({ message: "Booking deleted" });
    } catch (err) {
      next(err);
    }
  }
)

// update status of booked cruise /cruisies/book/:id/status
router.put("/book/:id/status", authMiddleware,
  authorize("manage_booked_cruises"),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const bookedCruisies = await BookedCruisies.findByIdAndUpdate(
        req.params.id,
        { status, reviewedAt: Date.now(), reviewedBy: req.user.id },
        { new: true, runValidators: true }
      );
      if (!bookedCruisies) return res.status(404).json({ error: "Booking not found" });
      res.json({ message: "Status updated", booking: bookedCruisies });
    } catch (err) {
      next(err);
    }
  }
)

/**
 * GET /cruisies/:id
 * Get single cruise by ID - PUBLIC ROUTE
 * NOTE: This must come AFTER all /book/* routes to avoid
 * Express matching "book" as an :id parameter.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const cruise = await Cruisies.findById(req.params.id);
    if (!cruise) {
      return res.status(404).json({ error: "Cruise not found" });
    }
    const response = {
      ...cruise.toObject(),
      images: cruise.images ? cruise.images.map(normalizeImagePath) : []
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// export router so it can be used in index.js
// DELETE IMAGE FROM CRUISE
router.delete(
  "/:id/images/:imageName",
  authMiddleware,
  authorize("delete_cruise"),
  async (req, res, next) => {
    try {
      const { id, imageName } = req.params;

      const cruise = await Cruisies.findById(id);
      if (!cruise) {
        return res.status(404).json({ error: "Cruise not found" });
      }

      // remove from DB
      cruise.images = cruise.images.filter(img => {
        const name = img.split('/').pop();
        return name !== imageName;
      });

      await cruise.save();

      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join("/app/uploads/Cruisies", path.basename(imageName));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: "Image deleted successfully", cruise });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
