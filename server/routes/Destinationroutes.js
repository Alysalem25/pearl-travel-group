const express = require("express");
const router = express.Router();
const Distination = require("../models/Destination");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

// POST — create a new destination
router.post("/",  async (req, res, next) => {
    try {
        const { contry, city, hotelName, note } = req.body;

        const destination = new Distination({ contry, city, hotelName, note });
        await destination.save();

        res.status(201).json({
            message: "Destination created successfully",
            data: destination,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
});

// GET — fetch all destinations
router.get("/", async (req, res, next) => {
    try {
        const destinations = await Distination.find().sort({ createdAt: -1 });
        res.json(destinations);
    } catch (err) {
        next(err);
    }
});

// PUT — update a destination by id
router.put("/:id",  async (req, res, next) => {
    try {
        const { contry, city, hotelName, note } = req.body;

        const destination = await Distination.findByIdAndUpdate(
            req.params.id,
            { contry, city, hotelName, note },
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({ error: "Destination not found" });
        }

        res.json({
            message: "Destination updated successfully",
            data: destination,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
});

module.exports = router;