const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { hasPermission } = require("../utils/permission");
const Flights = require("../models/Flights");
const BookedPrograms = require("../models/BookedPrograms");
const BookedCruises = require("../models/BookedCruseies");
const Visa = require("../models/Visa");
const CarTrip = require("../models/CarsTrips");
const HotelBooking = require("../models/HotelBooking");
const Mice = require("../models/Mice");

const router = express.Router();

const inquiryTypes = [
  {
    model: Flights,
    permission: "manage_booked_flights",
    category: "Flight",
    path: "/Admindashbord/flights"
  },
  {
    model: BookedPrograms,
    permission: "manage_booked_programs",
    category: "Program",
    path: "/Admindashbord/bookedPrograms"
  },
  {
    model: BookedCruises,
    permission: "manage_booked_cruises",
    category: "Cruise",
    path: "/Admindashbord/bookedCrusies"
  },
  {
    model: Visa,
    permission: "manage_visa",
    category: "Visa",
    path: "/Admindashbord/visa"
  },
  {
    model: CarTrip,
    permission: "manage_booked_transportation",
    category: "Transportation",
    path: "/Admindashbord/transportation"
  },
  {
    model: HotelBooking,
    permission: "manage_booked_hotels",
    category: "Hotel",
    path: "/Admindashbord/hotel"
  },
  {
    model: Mice,
    permission: "manage_booked_mice",
    category: "MICE",
    path: "/Admindashbord/mice"
  }
];

router.get("/inquiries/pending-counts", authMiddleware, async (req, res, next) => {
  try {
    const counts = {};
    await Promise.all(
      inquiryTypes
        .filter((type) => hasPermission(req.user, type.permission))
        .map(async ({ model, permission }) => {
          counts[permission] = await model.countDocuments({ status: "pending" });
        })
    );

    res.json({ counts });
  } catch (error) {
    next(error);
  }
});

router.get("/inquiries", authMiddleware, async (req, res, next) => {
  let since = null;
  if (req.query.since !== undefined) {
    if (typeof req.query.since !== "string") {
      return res.status(400).json({ error: "A valid since timestamp is required" });
    }

    since = new Date(req.query.since);
    if (Number.isNaN(since.getTime())) {
      return res.status(400).json({ error: "A valid since timestamp is required" });
    }
  }

  const checkedAt = new Date();
  if (!since) {
    return res.json({ checkedAt: checkedAt.toISOString(), inquiries: [] });
  }

  try {
    const results = await Promise.all(
      inquiryTypes
        .filter((type) => hasPermission(req.user, type.permission))
        .map(async ({ model, permission, category, path }) => {
          const records = await model
            .find({
              createdAt: { $gt: since, $lte: checkedAt }
            })
            .select("_id createdAt")
            .sort({ createdAt: 1 })
            .limit(100)
            .lean();

          return records.map((record) => ({
            id: `${permission}:${record._id}`,
            category,
            path,
            createdAt: record.createdAt
          }));
        })
    );

    res.json({
      checkedAt: checkedAt.toISOString(),
      inquiries: results.flat()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
