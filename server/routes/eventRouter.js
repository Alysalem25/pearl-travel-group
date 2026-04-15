const express = require("express");
const upload = require("../middlewares/eventUpload");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const Event = require("../models/Event");
const router = express.Router();

/**
 * Image path normalization helper
 */
function normalizeImagePath(imagePath) {
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  return `/uploads/events/${imagePath}`;
}

/**
 * GET /events
 * Get all events - PUBLIC
 * Query params: category, country, status, featured
 */
router.get("/", async (req, res, next) => {
  try {
    const { category, country, status, featured, upcoming } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (country) query.country = country;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;
    if (upcoming === 'true') {
      query.eventDate = { $gte: new Date() };
      query.status = { $in: ['upcoming', 'ongoing'] };
    }

    const events = await Event.find(query)
      .populate("category", "nameEn nameAr")
      .sort({ eventDate: 1 });

    const normalizedEvents = events.map(event => ({
      ...event.toObject(),
      images: event.images ? event.images.map(normalizeImagePath) : []
    }));

    res.json(normalizedEvents);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /events/featured
 * Get featured events - PUBLIC
 */
router.get("/featured", async (req, res, next) => {
  try {
    const events = await Event.find({ 
      isFeatured: true,
      status: { $in: ['upcoming', 'ongoing'] }
    })
      .populate("category", "nameEn nameAr")
      .sort({ eventDate: 1 })
      .limit(6);

    const normalizedEvents = events.map(event => ({
      ...event.toObject(),
      images: event.images ? event.images.map(normalizeImagePath) : []
    }));

    res.json(normalizedEvents);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /events/category/:categoryId
 * Get events by category - PUBLIC
 */
router.get("/category/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { country } = req.query;

    const query = { 
      category: categoryId,
      status: { $in: ['upcoming', 'ongoing'] }
    };
    if (country) query.country = country;

    const events = await Event.find(query)
      .populate("category", "nameEn nameAr")
      .sort({ eventDate: 1 });

    const normalizedEvents = events.map(event => ({
      ...event.toObject(),
      images: event.images ? event.images.map(normalizeImagePath) : []
    }));

    res.json(normalizedEvents);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /events/:id
 * Get single event - PUBLIC
 */
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category", "nameEn nameAr");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const normalizedEvent = {
      ...event.toObject(),
      images: event.images ? event.images.map(normalizeImagePath) : []
    };

    res.json(normalizedEvent);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /events
 * Create event - ADMIN ONLY
 */
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      const eventData = {
        ...req.body,
        images: (req.files || []).map(f => "/uploads/events/" + f.filename)
      };

      // Parse arrays if sent as JSON strings
      if (eventData.tagsEn) eventData.tagsEn = JSON.parse(eventData.tagsEn);
      if (eventData.tagsAr) eventData.tagsAr = JSON.parse(eventData.tagsAr);

      const event = new Event(eventData);
      await event.save();
      await event.populate("category", "nameEn nameAr");

      const response = {
        ...event.toObject(),
        images: event.images.map(normalizeImagePath)
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /events/:id
 * Update event - ADMIN ONLY
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      const existingEvent = await Event.findById(req.params.id);
      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      let images = existingEvent.images || [];
      
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => "/uploads/events/" + f.filename);
        images = [...images, ...newImages];
      }

      const updateData = {
        ...req.body,
        images
      };

      // Parse arrays if sent as JSON strings
      if (updateData.tagsEn) updateData.tagsEn = JSON.parse(updateData.tagsEn);
      if (updateData.tagsAr) updateData.tagsAr = JSON.parse(updateData.tagsAr);

      const event = await Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("category", "nameEn nameAr");

      const response = {
        ...event.toObject(),
        images: event.images.map(normalizeImagePath)
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /events/:id
 * Delete event - ADMIN ONLY
 */
router.delete("/:id", authMiddleware, authorize("admin"), async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /events/:id/images/:imageName
 * Delete event image - ADMIN ONLY
 */
router.delete("/:id/images/:imageName", authMiddleware, authorize("admin"), async (req, res, next) => {
  try {
    const { id, imageName } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.images = event.images.filter(img => {
      return img !== imageName && img !== `/uploads/events/${imageName}`;
    });

    await event.save();

    // Delete from filesystem
    const fs = require('fs');
    const path = require('path');
    const imagePath = path.join('/app/uploads/events', path.basename(imageName));
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ 
      message: "Image deleted successfully",
      images: event.images
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;