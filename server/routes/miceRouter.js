const express = require("express");
const router = express.Router();
const Mice = require("../models/Mice");
const User = require("../models/Users");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const { logSuccess, logError } = require("../utils/loggerService");
const { body, validationResult } = require("express-validator");

router.post("/", async (req, res, next) => {
    try {
        console.log("Received MICE request:", req.body);
        const {
            firstName,
            lastName,
            email,
            organization,
            jobFunction,
            nationality,
            numOfGuests,
            dateFrom,
            dateTo,
            destination,
        } = req.body;

        const mice = new Mice({
            firstName,
            lastName,
            email,
            organization,
            jobFunction,
            nationality,
            numOfGuests,
            dateFrom,
            dateTo,
            destination,
        });

        await mice.save();

        // await logSuccess(req.user._id, "CREATE_MICE", "Mice", mice._id, req);

        res.status(201).json({
            message: "Mice request created successfully",
            data: mice,
        });
    } catch (err) {
        // await logError(req.user._id, "CREATE_MICE", "Mice", req, err.message);
        next(err);
    }

},
);


router.get(
    "/",
    // authMiddleware,
    // authorize("manage_booked_mice"),
    async (req, res, next) => {
        try {

            const mice = await Mice.find().populate("reviewedBy", "name");

            // await logSuccess(req.user._id, "SEARCH_MICE", "Mice", null, req, {
            //     resultCount: mice.length,
            // });

            res.json(mice);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    "/:id",
    authMiddleware,
    // authorize("manage_booked_mice"),
    async (req, res, next) => {
        try {
            const mice = await Mice.findByIdAndDelete(req.params.id);

            if (!mice) {
                return res.status(404).json({ error: "Mice not found" });
            }

            // await logSuccess(req.user._id, "DELETE_MICE", "Mice", req.params.id, req);

            res.json({ message: "Mice deleted" });
        } catch (err) {
            // await logError(req.user._id, "DELETE_MICE", "Mice", req, err.message);
            next(err);
        }
    },
);

router.put(
    "/:id/status",
    authMiddleware,
    // authorize("manage_booked_mice"),
    async (req, res, next) => {
        try {
            const { status } = req.body;

            if (!["pending", "reviewed"].includes(status)) {
                return res.status(400).json({ error: "Invalid status value" });
            }

            const mice = await Mice.findByIdAndUpdate(
                req.params.id,
                {
                    status,
                    reviewedBy: req.user._id,
                },
                { new: true },
            );

            if (!mice) {
                return res.status(404).json({ error: "Mice not found" });
            }

            // await logSuccess(req.user._id, "EDIT_MICE", "Mice", mice._id, req, {
            //     newStatus: status,
            // });

            res.json(mice);
        } catch (err) {
            // await logError(req.user._id, "EDIT_MICE", "Mice", req, err.message);
            next(err);
        }
    },
);

module.exports = router;
