const express = require("express");
const router = express.Router();
const CarTrip = require("../models/CarsTrips");
const User = require("../models/Users");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const { logSuccess, logError } = require("../utils/loggerService");
const { body } = require("express-validator");


router.post("/", async (req, res, next) => {
  try {

    // Ensure isReturn is a boolean if it comes as a string or undefined
    const tripData = {
      ...req.body,
      isReturn: req.body.isReturn === true || req.body.isReturn === 'true'
    };

    const carTrip = new CarTrip(tripData);
    await carTrip.save();
    
    // 🔹 Log create car trip action
    const user = await User.findOne({ email: req.body.userEmail });
    if (user) {
      await logSuccess(user._id, "CREATE_TRANSPORTATION", "Transportation", carTrip._id, req, {
        destination: req.body.destination,
        isReturn: tripData.isReturn
      });
    }

    res.status(201).json({ 
        message: "Trip created successfully", 
        data: carTrip 
    });
  } catch (err) {
    // Catch Mongoose validation errors
    if (err.name === 'ValidationError') {
      await logError(null, "CREATE_TRANSPORTATION", "Transportation", req, err.message, {
        userEmail: req.body.userEmail
      });
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});


// admin get all car trips
router.get("/", async (req, res, next) => {
  try {
    const carTrips = await CarTrip.find().populate("reviewedBy", "name");
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_TRANSPORTATION", "Transportation", null, req, {
        resultCount: carTrips.length
      });
    }
    
    res.json(carTrips);
  } catch (err) {
    next(err);
  }
});

// delete car trip
router.delete("/:id", authMiddleware, authorize("manage_booked_transportation"), async (req, res, next) => {
  try {
    const carTrip = await CarTrip.findByIdAndDelete(req.params.id);
    if (!carTrip) {
      await logError(req.user._id, "DELETE_TRANSPORTATION", "Transportation", req, "Car trip not found", {
        tripId: req.params.id
      });
      return res.status(404).json({ error: "Car trip not found" });
    }
    
    // 🔹 Log delete action
    await logSuccess(req.user._id, "DELETE_TRANSPORTATION", "Transportation", req.params.id, req);
    
    res.json({ message: "Car trip deleted" });
  } catch (err) {
    // 🔹 Log error
    await logError(req.user._id, "DELETE_TRANSPORTATION", "Transportation", req, err.message, {
      tripId: req.params.id
    });
    next(err);
  }
});

// update car trip status
router.put("/:id/status", authMiddleware, authorize("manage_booked_transportation"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const carTrip = await CarTrip.findByIdAndUpdate(
      req.params.id,
      { status: status === "pending" ? "pending" : "reviewed" , reviewedBy: req.user.id },
      { new: true, runValidators: true }
    );
    if (!carTrip) {
      await logError(req.user._id, "EDIT_TRANSPORTATION", "Transportation", req, "Car trip not found", {
        tripId: req.params.id
      });
      return res.status(404).json({ error: "Car trip not found" });
    }
    
    // 🔹 Log edit action
    await logSuccess(req.user._id, "EDIT_TRANSPORTATION", "Transportation", carTrip._id, req, {
      newStatus: status
    });
    
    res.json(carTrip);
  } catch (err) {
    // 🔹 Log error
    await logError(req.user._id, "EDIT_TRANSPORTATION", "Transportation", req, err.message, {
      tripId: req.params.id
    });
    next(err);
  }
});
module.exports = router;