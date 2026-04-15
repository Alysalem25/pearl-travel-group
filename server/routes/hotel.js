const express = require("express");
const router = express.Router();
const HotelBooking = require("../models/HotelBooking");
const User = require("../models/Users");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const { logSuccess, logError } = require("../utils/loggerService");

router.post("/", async (req, res, next) => {
    try {
  

        // Ensure isReturn is a boolean if it comes as a string or undefined
        const tripData = {
            ...req.body,
            isReturn: req.body.isReturn === true || req.body.isReturn === 'true'
        };

        const booking = new HotelBooking(tripData);
        await booking.save();
        
        // 🔹 Log create hotel booking
        const user = await User.findOne({ email: req.body.userEmail });
        if (user) {
            await logSuccess(user._id, "CREATE_HOTEL", "Hotel", booking._id, req, {
                hotelCity: req.body.destination,
                isReturn: tripData.isReturn
            });
        }

        res.status(201).json({
            message: "Trip created successfully",
            data: booking
        });
    } catch (err) {
        // Catch Mongoose validation errors
        if (err.name === 'ValidationError') {
            await logError(null, "CREATE_HOTEL", "Hotel", req, err.message, {
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
        const hotelBookings = await HotelBooking.find().populate("reviewedBy", "name");
        
        // 🔹 Log search action
        if (req.user) {
            await logSuccess(req.user._id, "SEARCH_HOTEL", "Hotel", null, req, {
                resultCount: hotelBookings.length
            });
        }
        
        res.json(hotelBookings);
    } catch (err) {
        next(err);
    }
});

// delete car trip
router.delete("/:id", authMiddleware, authorize("manage_booked_hotels"), async (req, res, next) => {
    try {
        const booking = await HotelBooking.findByIdAndDelete(req.params.id);
        if (!booking) {
            await logError(req.user._id, "DELETE_HOTEL", "Hotel", req, "Hotel booking not found", {
                bookingId: req.params.id
            });
            return res.status(404).json({ error: "Hotel booking not found" });
        }
        
        // 🔹 Log delete action
        await logSuccess(req.user._id, "DELETE_HOTEL", "Hotel", req.params.id, req);
        
        res.json({ message: "Hotel booking deleted" });
    } catch (err) {
        // 🔹 Log error
        await logError(req.user._id, "DELETE_HOTEL", "Hotel", req, err.message, {
            bookingId: req.params.id
        });
        next(err);
    }
});

// update car trip status
router.put("/:id/status", authMiddleware, authorize("manage_booked_hotels"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const booking = await HotelBooking.findByIdAndUpdate(
      req.params.id,
      { status: status === "pending" ? "pending" : "reviewed" , reviewedBy: req.user.id },
      { new: true, runValidators: true }
    );
    if (!booking) {
      await logError(req.user._id, "EDIT_HOTEL", "Hotel", req, "Hotel booking not found", {
        bookingId: req.params.id
      });
      return res.status(404).json({ error: "Hotel booking not found" });
    }
    
    // 🔹 Log edit action
    await logSuccess(req.user._id, "EDIT_HOTEL", "Hotel", booking._id, req, {
      newStatus: status
    });
    
    res.json(booking);
  } catch (err) {
    // 🔹 Log error
    await logError(req.user._id, "EDIT_HOTEL", "Hotel", req, err.message, {
      bookingId: req.params.id
    });
    next(err);
  }
});
module.exports = router;